SET statement_timeout = '120s';

ALTER TABLE "ProductAddOn" ADD COLUMN "productId" TEXT;
ALTER TABLE "ProductAddOn" ADD COLUMN "name" TEXT;
ALTER TABLE "ProductAddOn" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "ProductAddOn" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "ProductAddOn" ADD COLUMN "basePriceEgp" DECIMAL(10,2);
ALTER TABLE "ProductAddOn" ADD COLUMN "variants" JSONB NOT NULL DEFAULT '{}';

UPDATE "ProductAddOn" AS addon
SET
  "productId" = addon."outfitProductId",
  "name" = piece."name",
  "nameAr" = piece."nameAr",
  "basePriceEgp" = COALESCE(addon."priceOverrideEgp", piece."basePriceEgp")
FROM "Product" AS piece
WHERE piece."id" = addon."pieceProductId";

ALTER TABLE "ProductAddOn" ALTER COLUMN "productId" SET NOT NULL;
ALTER TABLE "ProductAddOn" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "ProductAddOn" ALTER COLUMN "basePriceEgp" SET NOT NULL;
ALTER TABLE "ProductAddOn" DROP CONSTRAINT IF EXISTS "ProductAddOn_outfitProductId_fkey";
ALTER TABLE "ProductAddOn" DROP CONSTRAINT IF EXISTS "ProductAddOn_pieceProductId_fkey";
DROP INDEX IF EXISTS "ProductAddOn_outfitProductId_pieceProductId_key";
DROP INDEX IF EXISTS "ProductAddOn_pieceProductId_idx";
ALTER TABLE "ProductAddOn" DROP COLUMN "outfitProductId";
ALTER TABLE "ProductAddOn" DROP COLUMN "pieceProductId";
ALTER TABLE "ProductAddOn" DROP COLUMN "priceOverrideEgp";
CREATE INDEX "ProductAddOn_productId_idx" ON "ProductAddOn"("productId");
ALTER TABLE "ProductAddOn" ADD CONSTRAINT "ProductAddOn_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ProductSizeWeight" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "minWeightKg" DECIMAL(6,2),
  "maxWeightKg" DECIMAL(6,2),
  CONSTRAINT "ProductSizeWeight_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductSizeWeight_productId_size_key" ON "ProductSizeWeight"("productId", "size");
ALTER TABLE "ProductSizeWeight" ADD CONSTRAINT "ProductSizeWeight_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
