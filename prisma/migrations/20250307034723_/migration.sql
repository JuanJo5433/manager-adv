/*
  Warnings:

  - You are about to drop the column `userId` on the `process` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "process" DROP CONSTRAINT "process_userId_fkey";

-- AlterTable
ALTER TABLE "process" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "process_users" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "process_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_users_processId_userId_key" ON "process_users"("processId", "userId");

-- AddForeignKey
ALTER TABLE "process_users" ADD CONSTRAINT "process_users_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_users" ADD CONSTRAINT "process_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
