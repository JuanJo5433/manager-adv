-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_processId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "processId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE SET NULL ON UPDATE CASCADE;
