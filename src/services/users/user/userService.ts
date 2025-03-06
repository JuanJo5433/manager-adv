// Importa la constante API_URL desde el archivo de constantes, que define la URL base de la API.
import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un usuario
interface User {
    id: string;
    username: string;
    email: string;
    // Otras propiedades relevantes...
}


/**
 * Función asíncrona para obtener la información de un usuario por su ID.
 * @param {string} id - ID del usuario que se desea obtener.
 * @returns {Promise<User>} Datos del usuario.
 */
export const getUserById = async (id: string): Promise<User> => {
    try {
        // Realiza una petición HTTP GET a la API para obtener el usuario con el ID especificado.
        const response = await fetch(`${API_URL}/users/user/${id}`);
        
        // Imprime en consola la respuesta recibida para fines de depuración.
        console.log("🚀 ~ getUserById ~ response:", response);

        // Procesa la respuesta y devuelve los datos en formato JSON utilizando la función handleResponse.
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