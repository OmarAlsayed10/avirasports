"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/modules/cart/cart.store";
import { useWishlistStore } from "@/modules/wishlist/wishlist.store";
import { useUIStore } from "@/modules/_shared/stores/ui.store";
import { useHasMounted } from "@/modules/_shared/hooks/use-has-mounted";
import { QuantitySelector } from "../quantity-selector";
import { VariantSelector } from "../variant-selector";
import { useLocale } from "@/modules/_shared/i18n/i18n.context";
import { calcDiscountedPrice } from "@/modules/_shared/utils/calc-discounted-price";
import { trackPixelEvent } from "@/modules/_shared/analytics/meta-pixel-events";
import { addToCartSectionTokens } from "./add-to-cart-section.tokens";
import type { AddToCartSectionProps } from "./add-to-cart-section.types";

export function AddToCartSection({
  product,
  variants,
  quantityOffers = [],
  onVariantSelect,
}: AddToCartSectionProps) {
  const hasMounted = useHasMounted();
  const { t } = useLocale();

  const defaultOffer = quantityOffers.length > 0 ? quantityOffers[0] : null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 1 ? variants[0].id : null,
  );
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(
    defaultOffer?.id ?? null,
  );
  const [quantity, setQuantity] = useState(defaultOffer?.quantity ?? 1);
  const [note, setNote] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? null;
  const selectedOffer =
    quantityOffers.find((offer) => offer.id === selectedOfferId) ?? null;

  const baseEffectivePrice = selectedVariant?.priceOverrideEgp
    ? typeof selectedVariant.priceOverrideEgp === "object"
      ? (
          selectedVariant.priceOverrideEgp as { toNumber: () => number }
        ).toNumber()
      : Number(selectedVariant.priceOverrideEgp)
    : calcDiscountedPrice(product.basePriceEgp, product.discountPercent);

  const effectivePrice = selectedOffer
    ? selectedOffer.offerPriceEgp / selectedOffer.quantity
    : baseEffectivePrice;

  const hasMultipleVariants = variants.length > 1;
  const needsSelection = hasMultipleVariants && !selectedVariantId;
  const stockCount =
    selectedVariant?.stockCount ??
    variants.reduce((s, v) => s + v.stockCount, 0);
  const outOfStock = !needsSelection && stockCount === 0;

  const savingsEgp = selectedOffer
    ? Math.round(
        baseEffectivePrice * selectedOffer.quantity -
          selectedOffer.offerPriceEgp,
      )
    : 0;

  const handleToggleOffer = (offer: {
    id: string;
    quantity: number;
    offerPriceEgp: number;
  }) => {
    if (selectedOfferId === offer.id) {

      setSelectedOfferId(null);
      setQuantity(1);
    } else {
      setSelectedOfferId(offer.id);
      setQuantity(offer.quantity);
    }
  };

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariantId ?? undefined,
        name: product.name,
        nameAr: product.nameAr ?? undefined,
        brand: product.brand,
        imageUrl: product.imageUrl,
        unitPriceEgp: effectivePrice,
        stockCount,
        attributes: selectedVariant?.attributes ?? undefined,
        note: note.trim() || undefined,
        quantityOfferId: selectedOfferId ?? undefined,
      },
      quantity,
    );
    trackPixelEvent.addToCart({
      content_id: product.id,
      content_name: product.name,
      price: effectivePrice,
      quantity: quantity,
    });
    setCartDrawerOpen(true);
    toast.success(t.product.addedToCart);
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      priceEgp: product.basePriceEgp,
      discountPercent: product.discountPercent ?? undefined,
    });
    toast(
      isWishlisted ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist,
    );
  };

  if (!hasMounted) {
    return (
      <div className={addToCartSectionTokens.skeleton}>
        <div className="h-10 bg-bg-page dark:bg-bg-surface rounded-stepper w-36" />
        <div className="h-12 bg-bg-page dark:bg-bg-surface rounded-btn-sm w-full" />
      </div>
    );
  }

  return (
    <div className={addToCartSectionTokens.wrapper}>
      {variants.length > 1 && (
        <VariantSelector
          variants={variants}
          selectedId={selectedVariantId}
          onSelect={(id) => {
            setSelectedVariantId(id);
            onVariantSelect?.(variants.find((v) => v.id === id) ?? null);
          }}
        />
      )}

      {quantityOffers.length > 0 && (
        <div className="rounded-xl border border-primary/25 bg-primary/[0.03] p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {t.product.quantityOffersBannerTitle}
            </span>
          </div>

          {quantityOffers.map((offer) => {
            const isChecked = selectedOfferId === offer.id;
            const perUnit = offer.offerPriceEgp / offer.quantity;
            const saving = Math.round(
              baseEffectivePrice * offer.quantity - offer.offerPriceEgp,
            );

            return (
              <label
                key={offer.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                  isChecked
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border-primary/20 bg-bg-white hover:border-primary/40"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => handleToggleOffer(offer)}
                />

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isChecked
                      ? "border-primary bg-primary"
                      : "border-border-primary/40 bg-white"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span className="flex-1 min-w-0">
                  <span className="font-medium text-text-primary">
                    {t.product.buyNItems(offer.quantity)}
                  </span>
                  <span className="ml-2 text-xs text-text-secondary">
                    {t.product.perItem(perUnit.toFixed(0))}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="font-semibold text-text-primary">
                    {t.product.offerPrice(offer.offerPriceEgp.toString())}
                  </span>
                  {saving > 0 && (
                    <span className="ml-2 rounded-full bg-sale/10 px-2 py-0.5 text-xs font-semibold text-sale">
                      -{saving}
                    </span>
                  )}
                </span>
              </label>
            );
          })}

          {selectedOffer && savingsEgp > 0 && (
            <p className="text-xs font-medium text-sale pt-1 text-center">
              {t.product.youSave(savingsEgp)}
            </p>
          )}
        </div>
      )}

      <QuantitySelector
        quantity={quantity}
        onChange={(q) => {
          if (selectedOffer && q !== selectedOffer.quantity) {
            setSelectedOfferId(null);
          }
          setQuantity(q);
        }}
        max={Math.min(stockCount, 99)}
      />

      <div>
        <label className={addToCartSectionTokens.noteLabel}>
          {t.product.noteLabel}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.product.notePlaceholder}
          rows={2}
          maxLength={200}
          className={addToCartSectionTokens.noteTextarea}
        />
      </div>

      <div className={addToCartSectionTokens.actionsRow}>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock || needsSelection}
          className={addToCartSectionTokens.addToCartBtn}
          aria-label={
            needsSelection
              ? t.product.options
              : outOfStock
                ? t.product.outOfStock
                : t.product.addToCart
          }
        >
          <ShoppingCart className="w-5 h-5" />
          {needsSelection
            ? t.product.options
            : outOfStock
              ? t.product.outOfStock
              : t.product.addToCart}
        </button>

        <button
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? t.wishlist.removeFromWishlist
              : t.wishlist.addToWishlist
          }
          aria-pressed={isWishlisted}
          className={addToCartSectionTokens.wishlistBtn}
        >
          <Heart
            className={
              isWishlisted
                ? addToCartSectionTokens.wishlistIcon.active
                : addToCartSectionTokens.wishlistIcon.inactive
            }
          />
        </button>
      </div>

      {outOfStock && (
        <p className={addToCartSectionTokens.outOfStockMsg}>
          {t.product.outOfStockMsg}
        </p>
      )}
    </div>
  );
}
