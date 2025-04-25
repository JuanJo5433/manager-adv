// Importa la constante API_URL desde el archivo de constantes, que define la URL base de la API.
import { API_URL } from "@/utils/constast";
import { Users } from "@/utils/types/types";


/**
 * Función asíncrona para obtener la información de un usuario por su ID.
 * @returns {Promise<User>} Datos del usuario.
 */
export const getUsers = async (): Promise<Users[]> => {
    try {
        // Realiza una petición HTTP GET a la API para obtener el usuario con el ID especificado.
        const response = await fetch(`${API_URL}/users`);
        
        // Procesa la respuesta y devuelve los datos en formato JSON utilizando la función handleResponse.
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al obtener el cliente: ${error.message}`);
        } else {
            throw new Error("Error al obtener el cliente");
        }
    }
};

/**
 * Función auxiliar que maneja la respuesta de la API.
 * Convierte la respuesta a JSON y verifica si la solicitud fue exitosa.
 * @param {Response} response - Respuesta de la API.
 * @returns {Promise<any>} Datos de la respuesta.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const handleResponse = async (response: Response): Promise<any> => {
    // Convierte el cuerpo de la respuesta en un objeto JSON.
    const data = await response.json();
    
    // Si la respuesta HTTP no fue exitosa (response.ok es false), lanza un error
    // utilizando el mensaje proporcionado por la API o un mensaje genérico.
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    
    // Devuelve los datos en formato JSON si la solicitud fue exitosa.
    return data;
};