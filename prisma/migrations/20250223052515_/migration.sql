/*
  Warnings:

  - Made the column `status` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "task" ALTER COLUMN "status" SET NOT NULL;
