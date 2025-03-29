import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { Task } from "@/utils/types/types";
import { Prisma } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "POST":
                await handlePostRequest(req, res);
                break;
            
            case "PUT":
                await handlePutRequest(req, res);
                break;
            default:
                res.setHeader("Allow", ["POST", "PUT"]);
                res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error en el endpoint de tareas");
    }
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = req.body;
        console.log("🚀 ~ taskData:", taskData);

        const newTask = await prisma.task.create({
            data: {
                title: taskData.title,
                description: taskData.description,
                process: { connect: { id: taskData.processId } },
                user: { connect: { id: taskData.userId } },
                deadline: taskData.deadline,
                priority: taskData.priority,
                status: Number(taskData.status),
            },
            include: {
                comments: true,
            },
        });

        res.status(201).json(newTask);
    } catch (error) {
        handleErrorResponse(res, error, "Error creando tarea");
    }
};
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
        }

        const { id, comments, user, ...data } = req.body as { id: string } & Prisma.TaskUpdateInput;
        console.log("🚀 ~ handlePutRequest ~ data:", data)

        if (!id) {
            return res.status(400).json({ message: "El ID de la tarea es obligatorio" });
        }

        const updateTask = await prisma.task.update({
            where: { id },
            data,
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                            },
                        },
                    },
                },
                user: true
            }
        });
        console.log("🚀 ~ handlePutRequest ~ updateTask:", updateTask)

        return res.status(200).json(updateTask);
    } catch (error) {
        handleErrorResponse(res, error, "Error al editar la tarea");
    }
};
