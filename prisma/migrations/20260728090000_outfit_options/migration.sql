ALTER TABLE "Product" ADD COLUMN "hasReturnPolicy" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "ProductAddOn" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "imageUrl" TEXT,
    "basePriceEgp" DECIMAL(10,2) NOT NULL,
    "variants" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductAddOn_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductAddOn_productId_idx" ON "ProductAddOn"("productId");
ALTER TABLE "ProductAddOn" ADD CONSTRAINT "ProductAddOn_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProductSizeWeight" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "minWeightKg" DECIMAL(6,2),
    "maxWeightKg" DECIMAL(6,2),
    CONSTRAINT "ProductSizeWeight_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProductSizeWeight_productId_size_key" ON "ProductSizeWeight"("productId", "size");
ALTER TABLE "ProductSizeWeight" ADD CONSTRAINT "ProductSizeWeight_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
