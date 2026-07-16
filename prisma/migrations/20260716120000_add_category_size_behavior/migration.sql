-- AlterTable
ALTER TABLE "public"."Category"
ADD COLUMN "hasMultipleSizes" BOOLEAN NOT NULL DEFAULT true;

-- Preserve the existing accessories rule when that conventional slug is present.
UPDATE "public"."Category"
SET "hasMultipleSizes" = false
WHERE LOWER("slug") = 'accessories';
