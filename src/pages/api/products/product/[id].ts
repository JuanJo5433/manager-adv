import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();

/**
 * Manejador principal de la API
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "GET":
                return await handleGetRequest(req, res);

            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                return res
                    .status(405)
                    .json({ error: `Método ${req.method} no permitido` });
        }
    } catch (error) {
        return handleErrorResponse(res, error, "Error en la API de productos");
    }
}

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
        const products = await prisma.products.findMany({
            where: { deletedAt: null, id: Array.isArray(id) ? id[0] : id },
            include: { productType: true },
        });
        // Verifica si se encontró el producto.
        if (!products) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado.',
            });
        }

  
        console.log("🚀 ~ handleGetRequest ~ products:", products)
        return res.status(200).json(products);
    } catch (error) {
        return handleErrorResponse(res, error, "Error obteniendo productos");
    }
};
