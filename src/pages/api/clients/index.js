import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const clients = await prisma.client.findMany({
          where: { deletedAt: null }
        });
        res.status(200).json(clients);
      } catch (error) {
        handleError(res, error, 'Error obteniendo clientes');
      }
      break;

    case 'POST':
      try {
        const newClient = await prisma.client.create({
          data: {
            ...req.body,
            deletedAt: null
          }
        });
        res.status(201).json(newClient);
      } catch (error) {
        handleError(res, error, 'Error creando cliente');
      }
      break;

    case 'PUT':
      try {
        // Obtenemos el id de los parámetros y lo convertimos a entero
        const idParam = req.query.id;
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'El id debe ser un número válido para actualizar' });
        }

        // Los datos a actualizar vienen en el body
        const data = req.body;
        const updatedClient = await prisma.client.update({
          where: { id },
          data
        });
        res.status(200).json(updatedClient);
      } catch (error) {
        handleError(res, error, 'Error actualizando cliente');
      }
      break;

    case 'DELETE':
      try {
        // Obtenemos el id de los parámetros y lo convertimos a entero
        const idParam = req.query.id;
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
          return res.status(400).json({ message: 'El id debe ser un número válido para eliminar' });
        }

        // Realizamos un borrado lógico: actualizamos el campo deletedAt con la fecha actual
        const deletedClient = await prisma.client.update({
          where: { id },
          data: { deletedAt: new Date() }
        });
        res.status(200).json(deletedClient);
      } catch (error) {
        handleError(res, error, 'Error eliminando cliente');
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const handleError = (res, error, defaultMessage) => {
  // Se imprime en consola para fines de debugging
  console.error('API Error:', error);
  res.status(500).json({
    message: error.message || defaultMessage
  });
};
