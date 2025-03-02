-- CreateTable
CREATE TABLE "process" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "processId" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
