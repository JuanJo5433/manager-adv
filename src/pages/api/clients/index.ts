import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Client } from "@/utils/types/types";


interface ErrorResponse {
    success: boolean;
    message: string;
}

interface PrismaError extends Error {
    code?: string;
    meta?: {
        target?: string[];
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Client | Client[] | ErrorResponse | { message: string; client: Client }>
) {
    try {
        switch (req.method) {
            case "GET":
                await handleGetRequest(res);
                break;
            case "POST":
                await handlePostRequest(req, res);
                break;
            case "PUT":
                await handlePutRequest(req, res);
                break;
            case "DELETE":
                await handleDeleteRequest(req, res);
                break;
            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        handlePrismaError(res, error, "Error general del servidor");
    }
}

const handleGetRequest = async (
    res: NextApiResponse<Client[] | ErrorResponse>
) => {
    try {
        const clients = await prisma.client.findMany({
            where: { deletedAt: null },
        });
        res.status(200).json(clients);
    } catch (error) {
        handlePrismaError(res, error, "Error obteniendo clientes");
    }
};

const handlePostRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Client | ErrorResponse>
) => {
    try {
        const { Process, ...clientData } = req.body;
        const newClient = await prisma.client.create({
          data: {
            ...clientData,
            deletedAt: null,
            Process: {
              create: Process, // aquí Process debe ser un array de objetos que cumplan el tipo de creación
            },
          },
        });
        res.status(201).json(newClient);
    } catch (error) {
        handlePrismaError(res, error, "Error creando cliente");
    }
};

const handlePutRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Client | ErrorResponse>
) => {
    try {
        const { id } = req.query;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de cliente inválido",
            });
        }

        const clientData: Partial<Client> = req.body;
        const { Process, ...updateData } = clientData;

        const updatedClient = await prisma.client.update({
            where: { id:id },
            data: updateData,
        });
        res.status(200).json(updatedClient);
    } catch (error) {
        handlePrismaError(res, error, "Error actualizando cliente");
    }
};

const handleDeleteRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse | { message: string; client: Client }>
) => {
    try {
        const { id } = req.query;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de cliente inválido",
            });
        }

        const deletedClient = await prisma.client.update({
            where: { id: id  },
            data: { deletedAt: new Date() },
        });
        res.status(200).json({
            message: "Cliente eliminado correctamente.",
            client: deletedClient,
        });
    } catch (error) {
        handlePrismaError(res, error, "Error eliminando cliente");
    }
};

const handlePrismaError = (
    res: NextApiResponse<ErrorResponse>,
    error: unknown,
    context: string
) => {
    const err = error as PrismaError;
    console.error(`${context}:`, err.message);

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: `${context}: Recurso no encontrado`,
        });
    }

    if (err.code === "P2002") {
        const field = err.meta?.target?.[0] || "campo único";
        return res.status(409).json({
            success: false,
            message: `${context}: Conflicto en ${field}`,
        });
    }

    res.status(500).json({
        success: false,
        message: `${context}: ${err.message || "Error desconocido"}`,
    });
};
