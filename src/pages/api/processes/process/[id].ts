// Importa la instancia de Prisma para interactuar con la base de datos.
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();

// Función principal del endpoint que maneja las peticiones HTTP.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Se evalúa el método HTTP de la solicitud.
    switch (req.method) {
        // Si el método es GET, se procesa la solicitud para obtener el proceso y sus detalles.
        case "GET":
            await handleGetRequest(req, res);
            break;
        // Si el método es PUT, se procesa la solicitud para actualizar el proceso.
        case "PUT":
            await handlePutRequest(req, res);
            break;
        case "DELETE":
            await handleDeleteRequest(req, res);
            break;
        // Para otros métodos no permitidos, se establecen los métodos permitidos y se devuelve un error 405.
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Función que maneja las solicitudes GET para obtener el proceso con sus tareas y comentarios.
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Extrae el parámetro 'id' de la query string de la solicitud.
        const { id } = req.query;

        // Valida que el 'id' esté presente en la solicitud.
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message:
                    'El parámetro "id" es requerido y debe ser una cadena.',
            });
        }

        // Consulta a la base de datos para obtener el proceso que coincida con el 'id',
        // incluyendo sus tareas y, para cada tarea, sus comentarios. También se incluye
        // la información del cliente relacionado.
        const processData = await prisma.process.findUnique({
            where: { id: id },
            include: {
                tasks: {
                    include: {
                        comments: {
                            include: {
                                user: {
                                    // Selecciona solo el campo username (u otros que necesites)
                                    select: { username: true, name: true },
                                },
                            },
                        },
                    },
                },
                client: true,
                users: true,
                products: true,
            },
        });

        // Verifica si se encontró el proceso.
        if (!processData) {
            return res.status(404).json({
                success: false,
                message: "Proceso no encontrado.",
            });
        }

        // Envía la respuesta con estado 200 y el proceso actualizado en formato JSON.
        res.status(200).json(processData);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handlePrismaError.
        handleErrorResponse(res, error, "Error al obtener el proceso");
    }
};
const handlePutRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message:
                    'El parámetro "id" es requerido y debe ser una cadena.',
            });
        }
        const { body } = req;
        const processData = await prisma.process.update({
            where: { id: id },
            data: body,
        });
        res.status(200).json(processData);
    } catch (error) {
        handleErrorResponse(res, error, "Error al obtener el proceso");
    }
};
const handleDeleteRequest = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        // Extrae el parámetro 'id' de la query string de la solicitud.
        const { id } = req.query;

        // Valida que el 'id' esté presente en la solicitud.
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message:
                    'El parámetro "id" es requerido y debe ser una cadena.',
            });
        }
        // Eliminar comentarios de las tareas del proceso
        await prisma.comments.deleteMany({
            where: {
                task: {
                    processId: id,
                },
            },
        });
        // Eliminar tareas del proceso
        await prisma.task.deleteMany({
            where: {
                processId: id,
            },
        });
        // Eliminar relaciones en ProcessProducts
        await prisma.processProducts.deleteMany({
            where: { processId: id },
        });
        // Eliminar relaciones en ProcessUsers
        await prisma.processUsers.deleteMany({
            where: { processId: id },
        });
        //Eliminar el proceso
        const processData = await prisma.process.delete({
            where: { id: id },
        });

        // Envía la respuesta con estado 200 y el proceso actualizado en formato JSON.
        res.status(200).json(processData);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handlePrismaError.
        handleErrorResponse(res, error, "Error al obtener el proceso");
    }
};
