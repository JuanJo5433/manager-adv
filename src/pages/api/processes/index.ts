// Importa la instancia de Prisma para interactuar con la base de datos.
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();

// Define el tipo de datos para el cuerpo de la solicitud POST.
interface ProcessRequestBody {
    // Define las propiedades esperadas en el body de la solicitud POST.
    // Ajusta estas propiedades según tu modelo de datos en Prisma.
    name: string;
    title: string;
    slug: string;
    clientId: number;
    userId: string;
    products: Object;
    status: number;
    tasks: Object;
    // Otras propiedades relevantes...
}

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
    // Imprime en consola el contenido del body para facilitar la depuración.
    console.log(req.body);

    try {
        // Valida y tipa el cuerpo de la solicitud.
        const body: ProcessRequestBody = req.body as ProcessRequestBody;

        // Crea un nuevo registro en la tabla "process" utilizando los datos recibidos en el body.
        const newProcess = await prisma.process.create({
            data: { ...body },
        });

        // Envía la respuesta con estado 201 (Creado) y devuelve el proceso recién creado en formato JSON.
        res.status(201).json(newProcess);
    } catch (error) {
        // En caso de error, se delega el manejo a la función handlePrismaError.
        handlePrismaError(res, error, "Error creando el proceso");
    }
};

// Función que maneja las solicitudes GET para obtener todos los procesos.
const handleGetRequest = async (res: NextApiResponse) => {
    try {
        // Consulta la base de datos para obtener todos los procesos,
        // incluyendo las relaciones: tareas (tasks) y cliente (client).
        const processes = await prisma.process.findMany({
            include: { tasks: true, client: true },
        });

        // Imprime en consola el resultado para facilitar la depuración.
        console.log(processes);

        // Envía la respuesta con estado 200 (OK) y devuelve los procesos en formato JSON.
        res.status(200).json(processes);
    } catch (error) {
        // En caso de error, se delega el manejo a la función handlePrismaError.
        handlePrismaError(res, error, "Error al obtener el proceso");
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
        // En caso de error, se delega el manejo a la función handlePrismaError.
        handlePrismaError(
            res,
            error,
            "Error al obtener la cantidad de procesos"
        );
    }
};

// Función para manejar errores provenientes de Prisma y enviar respuestas HTTP apropiadas.
const handlePrismaError = (
    res: NextApiResponse,
    error: any,
    entity: string
) => {
    // Registra el error en la consola.
    console.error(`Prisma Error: ${error.message}`);

    // Si el error es del tipo "P2025", significa que el registro no fue encontrado.
    if (error.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`,
        });
    }

    // Si el error es del tipo "P2002", indica un conflicto de datos únicos (por ejemplo, duplicación de un campo único).
    if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field
                ? `El ${field} ya está en uso`
                : "Conflicto de datos único",
        });
    }

    // Para cualquier otro error, se devuelve una respuesta con estado 500 (Error interno del servidor).
    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`,
    });
};
