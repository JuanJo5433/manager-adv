import { API_URL } from "@/utils/constast";

export const getClients = async () => {
    try {
        const response = await fetch(`${API_URL}/clients`);
        return await handleResponse(response);
    } catch (error) {
        throw new Error(`Error al obtener los clientes: ${error.message}`);
    }
};

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

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    return data;
};