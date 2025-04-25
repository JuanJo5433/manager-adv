import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "POST":
                return await handlePostRequest(req, res);
            case "PUT":
                return await handleEditRequest(req, res);
            case "DELETE":
                return await handleDeleteRequest(req, res);
            default:
                res.setHeader("Allow", ["POST", "PUT","DELETE"]);
                return res
                    .status(405)
                    .json({ error: `Método ${req.method} no permitido` });
        }
    } catch (error) {
        return handleErrorResponse(res, error, "Error en la API de productos");
    }
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { supplierId, supplierTypeId } = req.body;


        // Validar si el proveedor existe
        const supplierExists = await prisma.suppliers.findUnique({
            where: { id: supplierId },
        });

        if (!supplierExists) {
            return res.status(400).json({ error: "El proveedor no existe" });
        }

        // Validar si el tipo de proveedor existe
        const supplierTypeExists = await prisma.supplierType.findUnique({
            where: { id: supplierTypeId },
        });

        if (!supplierTypeExists) {
            return res
                .status(400)
                .json({ error: "El tipo de proveedor no existe" });
        }

        // Si ambos existen, creamos la relación
        const supplierType = await prisma.suppliersSupplierTypes.create({
            data: {
                supplierId,
                supplierTypeId,
            },
        });

        res.status(200).json(supplierType);
    } catch (error) {
        handleErrorResponse(res, error, "Error creando los tipos de proveedor");
    }
};

const handleEditRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { supplierTypes } = req.body; // esperamos un array de strings
        const {id} = req.query

      
         // Validar que exista el id
         if (!id) {
            return res.status(400).json({ error: "El id es requerido" });
        }
        if (typeof id === "string") {
            const response = await prisma.suppliersSupplierTypes.deleteMany({
                where: { supplierId: id },
            });
            if (!response){
                console.error("Error al eliminar los tipos de proveedor")
            }
            const responseCreate = await prisma.suppliersSupplierTypes.createMany({
                data: supplierTypes
            })
            res.status(200).json(responseCreate)

            
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
       
    } catch (error) {
        return handleErrorResponse(
            res,
            error,
            "Error al editar los tipos de proveedor"
        );
    }
};

const handleDeleteRequest = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { id } = req.query;

        // Validar que exista el id
        if (!id) {
            return res.status(400).json({ error: "El id es requerido" });
        }
        if (typeof id === "string") {
            const response = await prisma.suppliersSupplierTypes.delete({
                where: { id },
            });
            res.status(200).json(response);
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
    } catch (error) {
        handleErrorResponse(
            res,
            error,
            "Error al eliminar los tipos del proveedor"
        );
    }
};
