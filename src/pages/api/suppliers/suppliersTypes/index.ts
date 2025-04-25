import { handleErrorResponse } from "@/utils/handleErrorResponse";

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { SupplierType } from "@/utils/types/types";

interface ErrorResponse {
    success: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        | SupplierType
        | SupplierType[]
        | ErrorResponse
        | { message: string; supplierType: SupplierType }
    >
) {
    try {
        switch (req.method) {
            case "GET":
                await handleGetRequest(res);
                break;
            case "POST":
                await handlePostRequest(res, req);
                break;
            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error general del servidor");
    }
}

const handleGetRequest = async (res: NextApiResponse) => {
    try {
        const supplierType = await prisma.supplierType.findMany({
            where: { deletedAt: null },
          
        });
        res.status(200).json(supplierType);
    } catch (error) {
        handleErrorResponse(res, error, "Error obteniendo los tipos de proveedores");
    }
};

const handlePostRequest = async (res: NextApiResponse, req: NextApiRequest) => {
    try {
        const supplierType = await prisma.supplierType.create({
            data: req.body,
        });
        res.status(200).json(supplierType);
    } catch (error) {
        handleErrorResponse(res, error, "Error creando los tipos de proveedor");
    }
};
 