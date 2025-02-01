const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Datos del usuario a crear
  const userData = {
    email: 'juan@example.com',
    username: 'JuanJoDev',
    password: await bcrypt.hash('123', 10), // Hashea la contraseña
    name: 'Test User',
  };

  // Crear el usuario en la base de datos
  const user = await prisma.users.create({
    data: userData,
  });

  console.log('Usuario creado:', user);
}
main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });