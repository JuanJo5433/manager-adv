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
    res: NextApiResponse<Comments | Comments[] | ErrorResponse>
) {
    try {
        switch (req.method) {
            case "POST":
                await handlePostRequest(req, res);
                break;
            case "GET":
                await handleGetRequest(res);
                break;
            default:
                res.setHeader("Allow", ["POST", "GET"]);
                res.status(405).json({
                    success: false,
                    message: `Método ${req.method} no permitido`,
                });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error en el endpoint de comentarios");
    }
}

const handlePostRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Comments | ErrorResponse>
) => {
    try {
        const { text, taskId, userId } = req.body;

        // Validación de datos obligatorios
        if (!text || !taskId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos (text, taskId, userId) son requeridos",
            });
        }

        const newComment = await prisma.comments.create({
            data: { text, taskId, userId },
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

        res.status(201).json(newComment);
    } catch (error) {
        handleErrorResponse(res, error, "Error creando comentario");
    }
};

const handleGetRequest = async (
    res: NextApiResponse<Comments[] | ErrorResponse>
) => {
    try {
        const comments = await prisma.comments.findMany({
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

        res.status(200).json(comments);
    } catch (error) {
        handleErrorResponse(res, error, "Error obteniendo comentarios");
    }
};
