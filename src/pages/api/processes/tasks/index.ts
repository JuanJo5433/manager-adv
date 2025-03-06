import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

interface Task {
    title: string;
    description?: string | null;
    status: number;
    priority: string;
    deadline?: Date | null;
    userId: string;
    processId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

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
    res: NextApiResponse<Task | ErrorResponse>
) {
    try {
        switch (req.method) {
            case "POST":
                await handlePostRequest(req, res);
                break;

            default:
                res.setHeader("Allow", ["POST"]);
                res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        handlePrismaError(res, error, "Error en el endpoint de tareas");
    }
}

const handlePostRequest = async (
    req: NextApiRequest,
    res: NextApiResponse<Task | ErrorResponse>
) => {
    try {
        const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = req.body;

        // Validación básica de datos requeridos
        if (
            !taskData.title ||
            !taskData.status ||
            !taskData.priority ||
            !taskData.processId
        ) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos requeridos deben estar presentes",
            });
        }

        const newTask = await prisma.task.create({
            data: { ...taskData, status: Number(taskData.status) },
        });

        res.status(201).json(newTask);
    } catch (error) {
        handlePrismaError(res, error, "Error creando tarea");
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
