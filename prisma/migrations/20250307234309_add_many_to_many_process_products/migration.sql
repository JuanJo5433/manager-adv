/*
  Warnings:

  - You are about to drop the column `processId` on the `products` table. All the data in the column will be lost.
  - Made the column `clientId` on table `process` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_clientId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_processId_fkey";

-- AlterTable
ALTER TABLE "process" ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "processId";

-- CreateTable
CREATE TABLE "process_products" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "process_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_products_processId_productId_key" ON "process_products"("processId", "productId");

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_products" ADD CONSTRAINT "process_products_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_products" ADD CONSTRAINT "process_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
