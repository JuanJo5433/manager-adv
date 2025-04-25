/*
  Warnings:

  - You are about to drop the column `suppplierTypeId` on the `suppliers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nit]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nit` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_suppplierTypeId_fkey";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "suppplierTypeId",
ADD COLUMN     "nit" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "suppliers_supplier_types" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierTypeId" TEXT NOT NULL,

    CONSTRAINT "suppliers_supplier_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_supplier_types_supplierId_supplierTypeId_key" ON "suppliers_supplier_types"("supplierId", "supplierTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_nit_key" ON "suppliers"("nit");

-- AddForeignKey
ALTER TABLE "suppliers_supplier_types" ADD CONSTRAINT "suppliers_supplier_types_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers_supplier_types" ADD CONSTRAINT "suppliers_supplier_types_supplierTypeId_fkey" FOREIGN KEY ("supplierTypeId") REFERENCES "supplier_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
