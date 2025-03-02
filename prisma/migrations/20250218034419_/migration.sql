/*
  Warnings:

  - The `status` column on the `process` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `process` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `process` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_clientId_fkey";

-- AlterTable
ALTER TABLE "process" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "clientId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "process_slug_key" ON "process"("slug");

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
