-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('ALL', 'MALE', 'FEMALE', 'KIDS');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#6DDE26';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'ALL';

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");
