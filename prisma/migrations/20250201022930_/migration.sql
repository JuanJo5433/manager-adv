/*
  Warnings:

  - You are about to drop the column `correo` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `documento` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `observacion` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "clients_correo_key";

-- DropIndex
DROP INDEX "clients_documento_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "correo",
DROP COLUMN "documento",
DROP COLUMN "nombre",
DROP COLUMN "observacion",
DROP COLUMN "telefono",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "clients_document_key" ON "clients"("document");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
