/*
  Warnings:

  - You are about to drop the column `productId` on the `process` table. All the data in the column will be lost.
  - Added the required column `processId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_productId_fkey";

-- AlterTable
ALTER TABLE "process" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "processId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
