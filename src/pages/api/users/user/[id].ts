// Importa la instancia de Prisma para poder interactuar con la base de datos.
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
        });

        // Imprime en la consola los usuarios obtenidos para facilitar la depuración.
        console.log(users);

        // Envía una respuesta con estado 200 (OK) y devuelve los usuarios en formato JSON.
        res.status(200).json(users);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handlePrismaError.
        handlePrismaError(res, error, 'Error al obtener el usuario');
    }
};

/**
 * Función para manejar errores provenientes de Prisma y enviar respuestas HTTP apropiadas.
 * 'entity' es una cadena que describe la entidad con la que ocurrió el error, para personalizar el mensaje.
 */
const handlePrismaError = (res: NextApiResponse, error: any, entity: string) => {
    // Registra el mensaje de error en la consola para facilitar la depuración.
    console.error(`Prisma Error: ${error.message}`);

    // Si el error tiene el código "P2025", indica que el registro no fue encontrado.
    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`,
        });
    }

    // Si el error tiene el código "P2002", indica un conflicto con datos únicos (por ejemplo, duplicidad en un campo único).
    if (error.code === 'P2002') {
        // Se extrae el campo que está causando el conflicto, si está disponible.
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único',
        });
    }

    // Para cualquier otro error, se devuelve un error interno del servidor (500).
    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`,
    });
};