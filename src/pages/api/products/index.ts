import { handleErrorResponse } from '@/utils/handleErrorResponse';
import { Products } from '@/utils/types/types';
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
        const { name, productTypeId, price, discount, description, availability, imageUrl } = req.body as Products;
console.log(req.body )
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
                    connect: { id:productTypeId }, // Conectar con el tipo de producto usando su ID
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

        const { name, productTypeId, price, discount, description, availability, imageUrl } = req.body as Products;

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
                    connect: { id: productTypeId}, // Conectar con el tipo de producto usando su ID
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
