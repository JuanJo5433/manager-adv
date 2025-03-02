/*
  Warnings:

  - Added the required column `productId` to the `process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "process" ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
