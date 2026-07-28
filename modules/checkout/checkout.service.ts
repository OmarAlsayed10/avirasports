"use server";

import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth.config";
import { prisma, Prisma } from "@/infrastructure/db/prisma";
import { placeOrderSchema } from "@/modules/checkout/checkout.validators";
import { couponCodeSchema } from "@/modules/checkout/coupon.validators";
import { z } from "zod";
import { getShippingCostForGovernorate } from "@/modules/checkout/delivery.service";
import { rateLimit } from "@/infrastructure/rate-limit/limiter";
import type { ActionResult } from "@/modules/_shared/types/action-result.type";

type CouponValidation =
  | {
      ok: true;
      discountEgp: number;
      couponId: string;
      type: "PERCENT" | "FIXED";
      value: number;
    }
  | { ok: false; error: string; code: string };

async function validateCoupon(
  code: string,
  subtotalEgp: number,
): Promise<CouponValidation> {
  const now = new Date();
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive)
    return {
      ok: false,
      error: "Coupon code not found",
      code: "COUPON_INVALID",
    };
  if (coupon.validFrom > now || coupon.validUntil < now)
    return { ok: false, error: "Coupon has expired", code: "COUPON_EXPIRED" };
  if (
    coupon.maxRedemptions !== null &&
    coupon.redemptionCount >= coupon.maxRedemptions
  )
    return {
      ok: false,
      error: "Coupon has reached its limit",
      code: "COUPON_MAX_REDEEMED",
    };

  const minOrder = coupon.minOrderEgp ? Number(coupon.minOrderEgp) : 0;
  if (subtotalEgp < minOrder)
    return {
      ok: false,
      error: `Minimum order of ${minOrder} EGP required for this coupon`,
      code: "COUPON_MIN_NOT_MET",
    };

  const couponValue = Number(coupon.value);
  const discountEgp =
    coupon.type === "PERCENT"
      ? Math.round(subtotalEgp * (couponValue / 100))
      : couponValue;

  return {
    ok: true,
    discountEgp,
    couponId: coupon.id,
    type: coupon.type,
    value: couponValue,
  };
}

function generateOrderNumber(count: number): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `INZ-${year}-${month}-${String(count).padStart(6, "0")}`;
}

export async function placeOrder(
  rawInput: unknown,
): Promise<ActionResult<{ redirectTo: string; orderNumber: string }>> {
  const ip =
    headers().get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = rateLimit(`checkout:${ip}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return {
      ok: false,
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMITED",
    };
  }

  const parsed = placeOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    console.error("[placeOrder] Validation error:", parsed.error.issues);
    return {
      ok: false,
      error: "Please review your details and try again.",
      code: "VALIDATION",
    };
  }
  const input = parsed.data;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const productIds = input.cartItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: {
      variants: true,
      images: { where: { isPrimary: true }, take: 1 },
      quantityOffers: { where: { isActive: true } },
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const configuredAddOns = await prisma.productAddOn.findMany({
    where: {
      id: {
        in: input.cartItems.flatMap((item) =>
          item.addOnId ? [item.addOnId] : [],
        ),
      },
    },
  });

  type LineItem = {
    productId: string;
    variantId: string | null;
    productName: string;
    productBrand: string;
    variantAttributes: Record<string, string> | null;
    unitPriceEgp: number;
    quantity: number;
    imageUrl: string;
    note: string | null;
  };

  const lineItems: LineItem[] = [];
  for (const cartItem of input.cartItems) {
    const product = productMap.get(cartItem.productId);
    if (!product) {
      return { ok: false, error: `Product not found`, code: "NOT_FOUND" };
    }

    const configuredAddOn = cartItem.addOnId
      ? configuredAddOns.find(
          (option) =>
            option.id === cartItem.addOnId && option.productId === product.id,
        )
      : null;
    if (cartItem.addOnId && !configuredAddOn)
      return {
        ok: false,
        error: "Optional outfit piece is no longer available",
        code: "NOT_FOUND",
      };
    const basePrice = configuredAddOn
      ? Number(configuredAddOn.basePriceEgp)
      : Number(product.basePriceEgp);
    const selectedQuantityOffer = cartItem.quantityOfferId
      ? product.quantityOffers.find(
          (offer) => offer.id === cartItem.quantityOfferId,
        )
      : null;
    if (
      cartItem.quantityOfferId &&
      (!selectedQuantityOffer ||
        selectedQuantityOffer.quantity !== cartItem.quantity)
    ) {
      return {
        ok: false,
        error: "The selected offer is no longer valid for this quantity",
        code: "VALIDATION",
      };
    }
    const discount = product.discountPercent ?? 0;
    const unitPrice = selectedQuantityOffer
      ? Number(selectedQuantityOffer.offerPriceEgp) /
        selectedQuantityOffer.quantity
      : Math.round(basePrice * (1 - discount / 100));

    let variantId: string | null = null;
    let variantAttributes: Record<string, string> | null = null;

    if (cartItem.variantId) {
      const variant = product.variants.find((v) => v.id === cartItem.variantId);
      if (!variant) {
        return { ok: false, error: `Variant not found`, code: "NOT_FOUND" };
      }
      variantId = variant.id;
      variantAttributes = variant.attributes as Record<string, string>;
    }

    lineItems.push({
      productId: product.id,
      variantId,
      productName: configuredAddOn?.name ?? product.name,
      productBrand: product.brand,
      variantAttributes,
      unitPriceEgp: unitPrice,
      quantity: cartItem.quantity,
      imageUrl: product.images[0]?.url ?? "",
      note: cartItem.note ?? null,
    });
  }

  const subtotal = lineItems.reduce(
    (sum, li) => sum + li.unitPriceEgp * li.quantity,
    0,
  );
  const shippingCost = await getShippingCostForGovernorate(
    input.shipping.governorate,
  );

  let discountEgp = 0;
  let couponId: string | null = null;
  if (input.couponCode) {
    const couponResult = await validateCoupon(input.couponCode, subtotal);
    if (!couponResult.ok) return couponResult;
    discountEgp = couponResult.discountEgp;
    couponId = couponResult.couponId;
  }

  const totalEgp = Math.max(0, subtotal + shippingCost - discountEgp);

  // orderNumber is unique; under concurrent checkouts a count-based number can collide,
  // so we retry the whole transaction (which rolls back fully) with a fresh number on P2002.
  let orderNumber = "";
  const MAX_ATTEMPTS = 5;

  try {
    for (let attempt = 0; ; attempt++) {
      const orderCount = await prisma.order.count();
      orderNumber = generateOrderNumber(orderCount + 1 + attempt);

      try {
        await prisma.$transaction(async (tx) => {
          for (const li of lineItems) {
            if (li.variantId) {
              const updated = await tx.productVariant.updateMany({
                where: { id: li.variantId, stockCount: { gte: li.quantity } },
                data: { stockCount: { decrement: li.quantity } },
              });
              if (updated.count === 0) {
                throw new Error(`STOCK:${li.productName}`);
              }
            }
          }

          if (couponId) {
            // Atomic guarded increment: only claims a redemption while under the cap.
            const claimed = await tx.$executeRaw`
              UPDATE "Coupon"
              SET "redemptionCount" = "redemptionCount" + 1
              WHERE "id" = ${couponId}
                AND ("maxRedemptions" IS NULL OR "redemptionCount" < "maxRedemptions")`;
            if (claimed === 0) throw new Error("COUPON_LIMIT");
          }

          const order = await tx.order.create({
            data: {
              orderNumber,
              userId,
              status: "processing",
              paymentMethod: "CASH_ON_DELIVERY",
              shippingMethod: "STANDARD",
              email: input.contact.email,
              shippingFullName: input.contact.fullName,
              shippingPhone: input.contact.phone,
              shippingAddressLine: input.shipping.addressLine,
              shippingCity: input.shipping.city,
              shippingGovernorate: input.shipping.governorate,
              shippingPostalCode: input.shipping.postalCode,
              shippingCostEgp: shippingCost,
              subtotalEgp: subtotal,
              discountEgp,
              totalEgp,
              couponId,
            },
          });

          await tx.orderItem.createMany({
            data: lineItems.map((li) => ({
              orderId: order.id,
              productId: li.productId,
              productVariantId: li.variantId ?? null,
              productNameSnapshot: li.productName,
              productBrandSnapshot: li.productBrand,
              ...(li.variantAttributes != null && {
                variantAttributesSnapshot: li.variantAttributes,
              }),
              imageUrlSnapshot: li.imageUrl,
              unitPriceEgp: li.unitPriceEgp,
              quantity: li.quantity,
              subtotalEgp: li.unitPriceEgp * li.quantity,
              note: li.note,
            })),
          });
        });
        break; // committed successfully
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002" &&
          attempt < MAX_ATTEMPTS - 1
        ) {
          continue; // orderNumber collision — regenerate and retry
        }
        throw e;
      }
    }
  } catch (e) {
    console.error("[placeOrder] Transaction error:", e);
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("STOCK:")) {
      return {
        ok: false,
        error: `${msg.slice(6)} is out of stock`,
        code: "STOCK_UNAVAILABLE",
      };
    }
    if (msg === "COUPON_LIMIT") {
      return {
        ok: false,
        error: "Coupon has reached its limit",
        code: "COUPON_MAX_REDEEMED",
      };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[placeOrder] Prisma error code:", e.code, "meta:", e.meta);
    }
    return { ok: false, error: "Failed to create order", code: "INTERNAL" };
  }

  return {
    ok: true,
    data: {
      redirectTo: `/checkout/success?orderNumber=${orderNumber}`,
      orderNumber,
    },
  };
}

const applyCouponSchema = z.object({
  code: couponCodeSchema,
  subtotalEgp: z.number().positive(),
});

export async function applyCoupon(
  code: string,
  subtotalEgp: number,
): Promise<
  ActionResult<{
    discountEgp: number;
    type: "PERCENT" | "FIXED";
    value: number;
  }>
> {
  const parsed = applyCouponSchema.safeParse({ code, subtotalEgp });
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", code: "VALIDATION" };
  }

  const result = await validateCoupon(code, subtotalEgp);
  if (!result.ok) return result;
  return {
    ok: true,
    data: {
      discountEgp: result.discountEgp,
      type: result.type,
      value: result.value,
    },
  };
}
