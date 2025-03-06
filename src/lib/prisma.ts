import { PrismaClient } from "@prisma/client";

// Extender el tipo global para incluir la propiedad prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Función factory para crear instancia de Prisma Client
const prismaClientSingleton = (): PrismaClient => new PrismaClient();

// Obtener instancia global o crear nueva
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma: PrismaClient = globalForPrisma.prisma ?? prismaClientSingleton();

// Exportar la instancia única
export default prisma;

// Preservar instancia en desarrollo durante hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}