// Importa la instancia de Prisma para interactuar con la base de datos.
import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { Process } from "@/utils/types/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();


// Función handler principal que procesa las solicitudes HTTP entrantes.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "POST":
            await handlePostRequest(req, res);
            break;
        case "GET":
            // Verifica si la consulta contiene el parámetro `count`
            if (req.query.count === "true") {
                await handleCountRequest(res);
            } else {
                await handleGetRequest(res);
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Función que maneja las solicitudes POST para crear un nuevo proceso.
const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        // Valida y tipa el cuerpo de la solicitud.
        const body: Omit<Process, "id"| "createdAt"| "updatedAt" |"client" | "users" | "products" |"tasks" > = req.body;
        

        // Crea un nuevo registro en la tabla "process" utilizando los datos recibidos en el body.
        const newProcess = await prisma.process.create({
            data: { ...body
                
             },
        });

        // Envía la respuesta con estado 201 (Creado) y devuelve el proceso recién creado en formato JSON.
        res.status(201).json(newProcess);
    } catch (error) {
        // En caso de error, se delega el manejo a la función handleErrorResponse.
        handleErrorResponse(res, error, "Error creando el proceso");
    }
};

// Función que maneja las solicitudes GET para obtener todos los procesos.
const handleGetRequest = async (res: NextApiResponse) => {
    try {
        // Consulta la base de datos para obtener todos los procesos,
        // incluyendo las relaciones: tareas (tasks) y cliente (client).
        const processes = await prisma.process.findMany({
            include: { tasks: true, client: true, users: true },
        });


        // Envía la respuesta con estado 200 (OK) y devuelve los procesos en formato JSON.
        res.status(200).json(processes);
    } catch (error) {
        // En caso de error, se delega el manejo a la función handleErrorResponse.
        handleErrorResponse(res, error, "Error al obtener el proceso");
    }
};

// Función para obtener la cantidad de procesos.
const handleCountRequest = async (res: NextApiResponse) => {
    try {
        // Consulta la base de datos para obtener la cantidad de procesos.
        const processCount = await prisma.process.count();

        // Imprime en consola el resultado para facilitar la depuración.
        console.log(processCount);

        // Envía la respuesta con estado 200 (OK) y devuelve la cantidad de procesos en formato JSON.
        res.status(200).json(processCount);
    } catch (error) {
        // En caso de error, se delega el manejo a la función handleErrorResponse.
        handleErrorResponse(
            res,
            error,
            "Error al obtener la cantidad de procesos"
        );
    }
};

