-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameRepresentative" TEXT,
    "suppplierTypeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "urlWeb" TEXT,
    "conditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "supplier_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_suppplierTypeId_fkey" FOREIGN KEY ("suppplierTypeId") REFERENCES "supplier_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
