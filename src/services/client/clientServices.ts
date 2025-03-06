import { API_URL } from "@/utils/constast";
import { Client } from "@/utils/types/types";


// Define el tipo de datos para la respuesta de la API
interface ApiResponse {
    message?: string;
    data?: any;
}

/**
 * Obtiene todos los clientes desde la API.
 * @returns {Promise<Client[]>} Lista de clientes.
 */
export const getClients = async (): Promise<Client[]> => {
    try {
        const response = await fetch(`${API_URL}/clients`);
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Crea un nuevo cliente en la API.
 * @param {Client} clientData - Datos del cliente a crear.
 * @returns {Promise<Client>} Cliente creado.
 */
export const createClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
    try {
        const response = await fetch(`${API_URL}/clients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Actualiza un cliente existente en la API.
 * @param {number} id - ID del cliente a actualizar.
 * @param {Partial<Client>} clientData - Nuevos datos del cliente.
 * @returns {Promise<Client>} Cliente actualizado.
 */
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
    try {
        const response = await fetch(`${API_URL}/clients?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Elimina un cliente de la API (soft delete).
 * @param {number} id - ID del cliente a eliminar.
 * @returns {Promise<ApiResponse>} Respuesta de la API.
 */
export const deleteClient = async (id: string): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_URL}/clients?id=${id}`, {
            method: "DELETE",
        });
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Maneja la respuesta de la API.
 * @param {Response} response - Respuesta de la API.
 * @returns {Promise<any>} Datos de la respuesta.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const handleResponse = async (response: Response): Promise<any> => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    return data;
};