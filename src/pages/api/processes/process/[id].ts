// Importa la instancia de Prisma para interactuar con la base de datos.
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();


// Función principal del endpoint que maneja las peticiones HTTP.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Se evalúa el método HTTP de la solicitud.
    switch (req.method) {
        // Si el método es GET, se procesa la solicitud para obtener el proceso y sus detalles.
        case 'GET':
            await handleGetRequest(req, res);
            break;
        // Para otros métodos no permitidos, se establecen los métodos permitidos y se devuelve un error 405.
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Función que maneja las solicitudes GET para obtener el proceso con sus tareas y comentarios.
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Extrae el parámetro 'id' de la query string de la solicitud.
        const { id } = req.query;

        // Valida que el 'id' esté presente en la solicitud.
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "id" es requerido y debe ser una cadena.',
            });
        }

        // Consulta a la base de datos para obtener el proceso que coincida con el 'id',
        // incluyendo sus tareas y, para cada tarea, sus comentarios. También se incluye
        // la información del cliente relacionado.
        const processData = await prisma.process.findMany({
            where: { id: id },
            include: {
                tasks: {
                    include: { comments: true },
                },
                client: true,
                user: true,
            },
        });

        // Verifica si se encontró el proceso.
        if (!processData || processData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Proceso no encontrado.',
            });
        }

        // Recorre cada tarea del proceso (se asume que processData[0] existe).
        for (const task of processData[0].tasks) {
            task.comments = await Promise.all(task.comments.map(async (comment) => {
                const user = await prisma.users.findUnique({
                    where: { id: comment.userId },
                });
        
                return {
                    ...comment,
                    createdBy: user ? user.username : null, // Agregamos la propiedad createdBy
                };
            }));
        }
        


        // Envía la respuesta con estado 200 y el proceso actualizado en formato JSON.
        res.status(200).json(processData);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handlePrismaError.
        handlePrismaError(res, error, 'Error al obtener el proceso');
    }
};

// Función para manejar errores provenientes de Prisma y enviar respuestas HTTP apropiadas.
const handlePrismaError = (res: NextApiResponse, error: any, entity: string) => {
    // Registra el error en la consola.
    console.error(`Prisma Error: ${error.message}`);

    // Si el error tiene el código "P2025", significa que el registro no fue encontrado.
    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`,
        });
    }

    // Si el error tiene el código "P2002", indica un conflicto en datos únicos (por ejemplo, un campo duplicado).
    if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único',
        });
    }

    // Para cualquier otro error, se responde con un error interno del servidor (500).
    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`,
    });
};