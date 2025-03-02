const { PrismaClient } = require('@prisma/client');
const bcrypt  = require("bcrypt")
const prisma = new PrismaClient();

async function main() {
  // // Comentar la parte del usuario
  
  // const userData = {
  //   email: 'juan@example.com',
  //   username: 'JuanJoDev',
  //   password: await bcrypt.hash('123', 10), // Hashea la contraseña
  //   name: 'Dev User',
  // };

  // // Crear el usuario en la base de datos
  // const user = await prisma.users.create({
  //   data: userData,
  // });

  // console.log('Usuario creado:', user);
  

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

// Insertar los tipos de productos en la base de datos
for (const productType of productTypes) {
  await prisma.ProductType.create({
    data: productType,
  });
}

console.log('Tipos de productos creados');
 }

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
