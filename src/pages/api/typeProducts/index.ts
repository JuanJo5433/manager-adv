import { NextApiRequest, NextApiResponse } from 'next';

// Importa la instancia de Prisma desde la librería personalizada.
import prisma from '@/lib/prisma';

// Define el tipo de datos para el cuerpo de las solicitudes.
interface ProductTypeRequestBody {
    name: string;
    description?: string | null;
}


/**
 * Manejador principal de la API de tipos de productos
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                return await handleGetRequest(res);
            case 'POST':
                return await handlePostRequest(req, res);
            case 'PUT':
                return await handlePutRequest(req, res);
            case 'DELETE':
                return await handleDeleteRequest(req, res);
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).json({ error: `Método ${req.method} no permitido` });
        }
    } catch (error) {
        return handleErrorResponse(res, error, 'Error en la API de tipos de productos');
    }
}

/**
 * Obtener todos los tipos de productos
 */
const handleGetRequest = async ( res: NextApiResponse) => {
    try {
        const productTypes = await prisma.productType.findMany();
        return res.status(200).json(productTypes);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error obteniendo tipos de productos');
    }
};

/**
 * Crear un nuevo tipo de producto
 */
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { name} = req.body as ProductTypeRequestBody;

        const newProductType = await prisma.productType.create({
            data: { name },
        });

        return res.status(201).json(newProductType);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creando tipo de producto');
    }
};

/**
 * Actualizar un tipo de producto
 */
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        // Validar que el ID esté presente y sea un número.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID del tipo de producto requerido' });
        }

        const { name } = req.body as ProductTypeRequestBody;

        const updatedProductType = await prisma.productType.update({
            where: { id: parseInt(id, 10) },
            data: { name },
        });

        return res.status(200).json(updatedProductType);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error actualizando tipo de producto');
    }
};

/**
 * Eliminar un tipo de producto
 */
const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        // Validar que el ID esté presente y sea un número.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID del tipo de producto requerido' });
        }

        const deletedProductType = await prisma.productType.delete({
            where: { id: parseInt(id, 10) },
        });

        return res.status(200).json({ message: 'Tipo de producto eliminado', productType: deletedProductType });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error eliminando tipo de producto');
    }
};

/**
 * Manejo de errores de Prisma
 */
const handleErrorResponse = (res: NextApiResponse, error: any, message: string) => {
    console.error(`${message}:`, error);

    if (error.code === 'P2025') {
        return res.status(404).json({ success: false, message: `${message}: No encontrado` });
    }
    if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único',
        });
    }
    return res.status(500).json({ success: false, message: `${message}: ${error.message}` });
};