/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `products` table. All the data in the column will be lost.
  - Added the required column `productTypeId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "deletedAt",
DROP COLUMN "destination",
DROP COLUMN "duration",
DROP COLUMN "type",
ADD COLUMN     "productTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "product_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
