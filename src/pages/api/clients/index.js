import prisma from "@/lib/prisma";

/**
 * Maneja las solicitudes HTTP para la gestión de clientes.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            await handleGetRequest(req, res);
            break;

        case 'POST':
            await handlePostRequest(req, res);
            break;

        case 'PUT':
            await handlePutRequest(req, res);
            break;

        case 'DELETE':
            await handleDeleteRequest(req, res);
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

/**
 * Maneja las solicitudes GET para obtener todos los clientes.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const handleGetRequest = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { deletedAt: null }
        });
        res.status(200).json(clients);
    } catch (error) {
        handlePrismaError(res, error, 'Error obteniendo clientes');
    }
};

/**
 * Maneja las solicitudes POST para crear un nuevo cliente.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const handlePostRequest = async (req, res) => {
    try {
        const newClient = await prisma.client.create({
            data: {
                ...req.body,
                deletedAt: null
            }
        });
        res.status(201).json(newClient);
    } catch (error) {
        handlePrismaError(res, error, 'Error creando cliente');
    }
};

/**
 * Maneja las solicitudes PUT para actualizar un cliente existente.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const handlePutRequest = async (req, res) => {
    try {
        const { id } = req.query;
        const updatedClient = await prisma.client.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updatedClient);
    } catch (error) {
        handlePrismaError(res, error, 'Error actualizando cliente');
    }
};

/**
 * Maneja las solicitudes DELETE para eliminar un cliente (soft delete).
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const handleDeleteRequest = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedClient = await prisma.client.update({
            where: { id: parseInt(id, 10) },
            data: { deletedAt: new Date() },
        });
        res.status(200).json({ message: 'Cliente eliminado correctamente.', client: deletedClient });
    } catch (error) {
        handlePrismaError(res, error, 'Error eliminando cliente');
    }
};

/**
 * Maneja los errores de Prisma y devuelve una respuesta adecuada.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @param {Error} error - Error capturado.
 * @param {string} entity - Entidad afectada.
 */
const handlePrismaError = (res, error, entity) => {
    console.error(`Prisma Error: ${error.message}`);

    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`
        });
    }

    if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único'
        });
    }

    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`
    });
};