// Importa la instancia de Prisma para poder interactuar con la base de datos.
import { handleErrorResponse } from '@/utils/handleErrorResponse';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();


/**
 * Función handler principal que maneja las peticiones HTTP al endpoint.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Se evalúa el método HTTP de la solicitud.
    switch (req.method) {
        // Si el método es GET, se llama a la función handleGetRequest.
        case 'GET':
            await handleGetRequest(req, res);
            break;

        // Para cualquier otro método no permitido, se envía un error 405 (Method Not Allowed).
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

/**
 * Función que maneja las solicitudes GET para obtener usuarios basándose en un ID.
 */
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Extrae el parámetro 'id' de la query string de la solicitud.
        const { id } = req.query;

        // Valida que el parámetro 'id' esté presente y sea una cadena.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "id" es requerido y debe ser una cadena.',
            });
        }

        // Realiza una consulta a la base de datos para encontrar todos los usuarios que coincidan con el ID proporcionado.
        const users = await prisma.users.findMany({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                // Otros campos que consideres necesarios...
                // Asegúrate de NO incluir el campo password
              },
        });

        // Envía una respuesta con estado 200 (OK) y devuelve los usuarios en formato JSON.
        res.status(200).json(users);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handleErrorResponse.
        handleErrorResponse(res, error, 'Error al obtener el usuario');
    }
};

