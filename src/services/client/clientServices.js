import { API_URL } from "@/utils/constast";

export const getClients = async () => {
  try {
    const response = await fetch(`${API_URL}/client`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Error al obtener los clientes: ${error.message}`);
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await fetch(`${API_URL}/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Error al crear cliente: ${error.message}`);
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const response = await fetch(`${API_URL}/client?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Error al actualizar cliente (id: ${id}): ${error.message}`);
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await fetch(`${API_URL}/client?id=${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Error al eliminar cliente (id: ${id}): ${error.message}`);
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorResponse = await response.json();
    // Se puede agregar información adicional como el statusCode
    throw new Error(errorResponse.message || `Error en la solicitud (status: ${response.status})`);
  }
  return response.json();
};
