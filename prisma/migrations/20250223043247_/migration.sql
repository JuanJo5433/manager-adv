/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `task` table. All the data in the column will be lost.
  - Added the required column `userId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "assignedTo",
DROP COLUMN "status",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
