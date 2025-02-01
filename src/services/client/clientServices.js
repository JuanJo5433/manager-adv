import { API_URL } from "@/utils/constast";

/**
 * Obtiene todos los clientes desde la API.
 * @returns {Promise<Array>} Lista de clientes.
 */
export const getClients = async () => {
    try {
        const response = await fetch(`${API_URL}/clients`);
        return await handleResponse(response);
    } catch (error) {
        throw new Error(`Error al obtener los clientes: ${error.message}`);
    }
};

/**
 * Crea un nuevo cliente en la API.
 * @param {Object} clientData - Datos del cliente a crear.
 * @returns {Promise<Object>} Cliente creado.
 */
export const createClient = async (clientData) => {
    try {
        const response = await fetch(`${API_URL}/clients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });
        return await handleResponse(response);
    } catch (error) {
        throw new Error(`Error al crear cliente: ${error.message}`);
    }
};

/**
 * Actualiza un cliente existente en la API.
 * @param {number} id - ID del cliente a actualizar.
 * @param {Object} clientData - Nuevos datos del cliente.
 * @returns {Promise<Object>} Cliente actualizado.
 */
export const updateClient = async (id, clientData) => {
    try {
        const response = await fetch(`${API_URL}/clients?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });
        return await handleResponse(response);
    } catch (error) {
        throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
};

/**
 * Elimina un cliente de la API (soft delete).
 * @param {number} id - ID del cliente a eliminar.
 * @returns {Promise<Object>} Respuesta de la API.
 */
export const deleteClient = async (id) => {
    try {
        const response = await fetch(`${API_URL}/clients?id=${id}`, {
            method: "DELETE",
        });
        return await handleResponse(response);
    } catch (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
};

/**
 * Maneja la respuesta de la API.
 * @param {Response} response - Respuesta de la API.
 * @returns {Promise<Object>} Datos de la respuesta.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    return data;
};