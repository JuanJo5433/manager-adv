import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Comments } from "@/utils/types/types";
import { handleErrorResponse } from "@/utils/handleErrorResponse";

interface ErrorResponse {
    success: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Comments | ErrorResponse>
) {
    try {
        switch (req.method) {
            case "GET":
                await handleGetRequest(req, res);
                break;
            case "PUT":
                await handlePutRequest(req, res);
                break;
            case "DELETE":
                await handleDeleteRequest(req, res);
                break;
            default:
                res.setHeader("Allow", ["GET", "PUT"]);
                res.status(405).json({
                    success: false,
                    message: `Método ${req.method} no permitido`,
                });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error en el endpoint de comentarios");
    }
}

const handleGetRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Comments | ErrorResponse>
) => {
    try {
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de comentario inválido",
            });
        }

        const comment = await prisma.comments.findUnique({
            where: { id: id as string },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado",
            });
        }

        res.status(200).json(comment);
    } catch (error) {
        handleErrorResponse(res, error, "Error obteniendo el comentario");
    }
};

const handlePutRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Comments | ErrorResponse>
) => {
    try {
        const { id } = req.query;
        const { text } = req.body;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de comentario inválido",
            });
        }

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'El campo "text" es obligatorio',
            });
        }

        const updatedComment = await prisma.comments.update({
            where: { id: id as string },
            data: { text },
            select: {
                id: true,
                text: true,
                taskId: true,
                userId: true,
                createdAt: true,
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        handleErrorResponse(res, error, "Error actualizando el comentario");
    }
};

const handleDeleteRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse>
) => {
    try {
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de comentario inválido",
            });
        }

        await prisma.comments.delete({
            where: { id: id as string },
        });

        res.status(204).end();
    } catch (error) {
        handleErrorResponse(res, error, "Error eliminando el comentario");
    }
};
