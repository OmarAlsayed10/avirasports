-- CreateEnum
CREATE TYPE "HomepageSectionType" AS ENUM ('FEATURED', 'BEST_VALUE', 'HOLIDAY_OFFERS', 'CATEGORY_SHOWCASE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isHolidayOffer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "type" "HomepageSectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "productLimit" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomepageSection_isVisible_sortOrder_idx" ON "HomepageSection"("isVisible", "sortOrder");

-- AddForeignKey
ALTER TABLE "HomepageSection" ADD CONSTRAINT "HomepageSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
