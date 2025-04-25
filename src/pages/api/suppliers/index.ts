import { handleErrorResponse } from "@/utils/handleErrorResponse"; // Función reutilizable para manejar errores y enviar una respuesta estándar
import { Suppliers } from "@/utils/types/types"; // Tipado del modelo de proveedores
import prisma from "@/lib/prisma"; // Cliente de Prisma para interactuar con la base de datos
import { NextApiRequest, NextApiResponse } from "next"; // Tipos de Next.js para solicitudes y respuestas API

// Interfaz para representar una respuesta de error
interface ErrorResponse {
    success: boolean;
    message: string;
}

// Manejador principal para la API de proveedores
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        | Suppliers
        | Suppliers[]
        | ErrorResponse
        | { message: string; suppliers: Suppliers }
    >
) {
    try {
        // Manejo de diferentes métodos HTTP
        switch (req.method) {
            case "GET":
                await handleGetRequest(res); // Obtener lista de proveedores
                break;
            case "POST":
                await handlePostRequest(res, req); // Crear un nuevo proveedor
                break;
            case "PUT":
                await handleEditRequest(res, req); // Editar un proveedor existente
                break;
            case "DELETE":
                await handleDeleteRequest(res, req); // Eliminar un proveedor
                break;
            default:
                // Si el método no está permitido
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        // Manejo de errores generales
        handleErrorResponse(res, error, "Error general del servidor");
    }
}

// Función para manejar la solicitud GET
const handleGetRequest = async (res: NextApiResponse) => {
    try {
        const suppliers = await prisma.suppliers.findMany({
            where: { deletedAt: null }, // Solo proveedores no eliminados
            include: {
                supplierTypes: true, // Incluye la información del tipo de proveedor
            },
        });
        res.status(200).json(suppliers); // Respuesta exitosa con los proveedores encontrados
    } catch (error) {
        handleErrorResponse(res, error, "Error obteniendo proveedores");
    }
};

// Función para manejar la solicitud POST (crear nuevo proveedor)
const handlePostRequest = async (res: NextApiResponse, req: NextApiRequest) => {
    try {
        const suppliers = await prisma.suppliers.create({
            data: req.body, // Datos enviados en el cuerpo de la solicitud
        });
        res.status(200).json(suppliers); // Respuesta con el proveedor creado
    } catch (error) {
        handleErrorResponse(res, error, "Error creando proveedor");
    }
};

// Función para manejar la solicitud PUT (editar proveedor)
const handleEditRequest = async (res: NextApiResponse, req: NextApiRequest) => {
    try {
        const { id } = req.query; // ID del proveedor a editar
        const data = req.body; // Nuevos datos del proveedor

        // Validar que el ID sea una cadena
        if (typeof id === "string") {
            const suppliers = await prisma.suppliers.update({
                where: { id },
                data,
            });
            res.status(200).json(suppliers); // Respuesta con el proveedor actualizado
        } else {
            // Error si el formato del ID no es válido
            res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error editando el proveedor");
    }
};

// Función para manejar la solicitud DELETE (eliminar proveedor)
const handleDeleteRequest = async (res: NextApiResponse, req: NextApiRequest) => {
    try {
        const { id } = req.query; // ID del proveedor a eliminar

        // Validar que el ID sea una cadena
        if (typeof id === "string") {
            const response = await prisma.suppliers.delete({ where: { id } });
            res.status(200).json(response); // Respuesta con el proveedor eliminado
        } else {
            // Error si el ID no es válido
            res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Error eliminando proveedor");
    }
};
