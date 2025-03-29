import { handleErrorResponse } from '@/utils/handleErrorResponse';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();


/**
 * Manejador principal de la API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                return await handleGetRequest( res);

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).json({ error: `Método ${req.method} no permitido` });
        }
    } catch (error) {
        return handleErrorResponse(res, error, 'Error en la API de productos');
    }
}

/**
 * Obtener todos los usuarios (excluyendo los eliminados)
 */
const handleGetRequest = async (res: NextApiResponse) => {
    try {
        const users = await prisma.users.findMany();
        return res.status(200).json(users);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error obteniendo los usuarios');
    }
};



