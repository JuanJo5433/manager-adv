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
        handlePrismaError(res, error, 'Error obteniendo clientes');
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
        handlePrismaError(res, error, 'Error creando cliente');
      }
      break;

      case 'PUT':
        try {
          // Obtenemos el id de los parámetros y lo convertimos a entero
          const idParam = req.query.id;
          const id = parseInt(idParam, 10);
          if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
          }
      
          // Validar que el cliente exista
          const existingClient = await prisma.client.findUnique({ where: { id } });
          if (!existingClient) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
          }
      
          // Los datos a actualizar vienen en el body
          const data = req.body;
      
          // Validar que los datos no estén vacíos
          if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar datos para actualizar.' });
          }
      
          // Actualizar el cliente
          const updatedClient = await prisma.client.update({
            where: { id },
            data,
          });
      
          res.status(200).json(updatedClient);
        } catch (error) {
          handlePrismaError(res, error, 'Error actualizando cliente');
        }
        break;
        case 'DELETE':
          try {
            // Obtenemos el id de los parámetros y lo convertimos a entero
            const idParam = req.query.id;
            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
              return res.status(400).json({ message: 'El ID debe ser un número válido.' });
            }
        
            // Validar que el cliente exista
            const existingClient = await prisma.client.findUnique({ where: { id } });
            if (!existingClient) {
              return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
        
            // Realizar el borrado lógico
            const deletedClient = await prisma.client.update({
              where: { id },
              data: { deletedAt: new Date() },
            });
        
            res.status(200).json({ message: 'Cliente eliminado correctamente.', client: deletedClient });
          } catch (error) {
            handlePrismaError(res, error, 'Error eliminando cliente');
          }
          break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


const handlePrismaError = (res, error, entity) => {
  console.error(`Prisma Error: ${error.message}`);

  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: `${entity} no encontrado`
    });
  }

  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0];
    return res.status(409).json({
      success: false,
      message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único'
    });
  }

  res.status(500).json({
    success: false,
    message: `Error interno del servidor: ${error.message}`
  });
};