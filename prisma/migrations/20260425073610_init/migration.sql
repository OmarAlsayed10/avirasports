-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('STANDARD', 'EXPRESS');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'PAY_AT_FAWRY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "FawryStatus" AS ENUM ('INITIATED', 'PAID', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "governorate" TEXT NOT NULL,
    "postalCode" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "modelNumber" TEXT,
    "description" TEXT NOT NULL,
    "specs" JSONB NOT NULL,
    "categoryId" TEXT NOT NULL,
    "basePriceEgp" DECIMAL(10,2) NOT NULL,
    "discountPercent" INTEGER,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "priceOverrideEgp" DECIMAL(10,2),
    "stockCount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "addressId" TEXT,
    "email" TEXT NOT NULL,
    "shippingFullName" TEXT NOT NULL,
    "shippingPhone" TEXT NOT NULL,
    "shippingAddressLine" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingGovernorate" TEXT NOT NULL,
    "shippingPostalCode" TEXT,
    "shippingMethod" "ShippingMethod" NOT NULL,
    "shippingCostEgp" DECIMAL(10,2) NOT NULL,
    "subtotalEgp" DECIMAL(10,2) NOT NULL,
    "discountEgp" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEgp" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending_payment',
    "couponId" TEXT,
    "estimatedDeliveryDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "productNameSnapshot" TEXT NOT NULL,
    "productBrandSnapshot" TEXT NOT NULL,
    "variantAttributesSnapshot" JSONB,
    "imageUrlSnapshot" TEXT NOT NULL,
    "unitPriceEgp" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotalEgp" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FawryPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "fawryRefNumber" TEXT,
    "merchantRefNum" TEXT NOT NULL,
    "amountEgp" DECIMAL(10,2) NOT NULL,
    "status" "FawryStatus" NOT NULL DEFAULT 'INITIATED',
    "expiryAt" TIMESTAMP(3) NOT NULL,
    "callbackPayload" JSONB,
    "callbackVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FawryPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "minOrderEgp" DECIMAL(10,2),
    "maxRedemptions" INTEGER,
    "redemptionCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'landing-page',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_userId_key" ON "Review"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FawryPayment_orderId_key" ON "FawryPayment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "FawryPayment_fawryRefNumber_key" ON "FawryPayment"("fawryRefNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FawryPayment_merchantRefNum_key" ON "FawryPayment"("merchantRefNum");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FawryPayment" ADD CONSTRAINT "FawryPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
