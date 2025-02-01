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
        const response = await fetch(`${API_URL}/client?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientData),
        });

        const data = await handleResponse(response);

        if (!data.success) {
            throw new Error(data.message || "Error actualizando cliente");
        }

        return data.data;
    } catch (error) {
        throw new Error(error.details?.message || error.message);
    }
};
export const deleteClient = async (id) => {
    try {
        const response = await fetch(`${API_URL}/clients?id=${id}`, {
            method: "DELETE",
        });
        return await handleResponse(response);
    } catch (error) {
        throw new Error(
            `Error al eliminar cliente (id: ${id}): ${error.message}`
        );
    }
};

const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Error en la solicitud");
        error.status = response.status;
        error.details = data;
        throw error;
    }

    return data;
};
