import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Datos del usuario
  const userData = {
    email: 'juan@example.com',
    username: 'JuanJoDev',
    password: await bcrypt.hash('123', 10), // Hashea la contraseña
    name: 'Dev User',
  };

  // Crear el usuario en la BD
  const user = await prisma.users.create({
    data: userData,
  });

  console.log('Usuario creado:', user);

  // Crear tipos de productos para una agencia de viajes
  const productTypes = [
    { name: 'Paquete Turístico' },
    { name: 'Vuelo' },
    { name: 'Hotel' },
    { name: 'Excursión' },
    { name: 'Seguro de Viaje' },
    { name: 'Traslado' },
    { name: 'Crucero' },
    { name: 'Alquiler de Autos' },
    { name: 'Guía Turística' },
    { name: 'Entrada a Atracciones' },
  ];

  // Insertar los tipos de productos en la BD
  for (const productType of productTypes) {
    await prisma.productType.create({
      data: productType,
    });
  }

  console.log('Tipos de productos creados');
}

main()
  .catch((e: Error) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
