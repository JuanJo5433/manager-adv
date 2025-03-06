import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();

// Define los tipos de datos para el cuerpo de las solicitudes.
interface ProductRequestBody {
    name: string;
    type: string; // ID del tipo de producto .
    price: number;
    discount?: number;
    description?: string;
    availability: boolean;
    imageUrl?: string;
}


/**
 * Manejador principal de la API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET':
                return await handleGetRequest( res);
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
        return handleErrorResponse(res, error, 'Error en la API de productos');
    }
}

/**
 * Obtener todos los productos (excluyendo los eliminados)
 */
const handleGetRequest = async (res: NextApiResponse) => {
    try {
        const products = await prisma.products.findMany({
            where: { deletedAt: null },
            include: { productType: true },
        });
        return res.status(200).json(products);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error obteniendo productos');
    }
};

/**
 * Crear un nuevo producto
 */
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { name, type, price, discount, description, availability, imageUrl } = req.body as ProductRequestBody;

        // Crear el nuevo producto y vincularlo con el tipo de producto por su ID
        const newProduct = await prisma.products.create({
            data: {
                name,
                price,
                discount,
                description,
                availability,
                imageUrl,
                productType: {
                    connect: { id:type }, // Conectar con el tipo de producto usando su ID
                },
            },
        });

        return res.status(201).json(newProduct);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creando producto');
    }
};

/**
 * Actualizar un producto
 */
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        // Validar que el ID esté presente y sea un número.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID del producto requerido' });
        }

        const { name, type, price, discount, description, availability, imageUrl } = req.body as ProductRequestBody;

        const updatedProduct = await prisma.products.update({
            where: { id: id},
            data: {
                name,
                price,
                discount,
                description,
                availability,
                imageUrl,
                productType: {
                    connect: { id: type}, // Conectar con el tipo de producto usando su ID
                },
            },
        });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return handleErrorResponse(res, error, 'Error actualizando producto');
    }
};

/**
 * Eliminar un producto (soft delete)
 */
const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        // Validar que el ID esté presente y sea un número.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID del producto requerido' });
        }

        const deletedProduct = await prisma.products.update({
            where: { id:id },
            data: { deletedAt: new Date() },
        });

        return res.status(200).json({ message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error eliminando producto');
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