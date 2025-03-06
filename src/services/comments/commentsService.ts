// Importa la constante API_URL desde el archivo de constantes.
// API_URL es la URL base que se utiliza para realizar solicitudes a la API.

import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un comentario
interface Comment {
    id: string;
    content: string;
    userId: string;
    taskId: string;
    createdAt: string;
    // Otras propiedades relevantes...
}



/**
 * Función asíncrona que obtiene los comentarios asociados a un ID específico.
 * @param {string} id - ID del recurso (por ejemplo, una tarea) para el cual se buscan los comentarios.
 * @returns {Promise<Comment[]>} Lista de comentarios.
 */
export const getCommentsById = async (id: string): Promise<Comment[]> => {
    try {
        // Realiza una solicitud HTTP a la API, construyendo la URL con el ID proporcionado.
        const response = await fetch(`${API_URL}/comments/comment/${id}`);
        
        // Muestra la respuesta en la consola para propósitos de depuración.
        console.log("🚀 ~ getCommentsById ~ response:", response);

        // Procesa la respuesta y devuelve los datos JSON usando la función auxiliar handleResponse.
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
 * Convierte la respuesta a formato JSON y verifica si la solicitud fue exitosa.
 * @param {Response} response - Respuesta de la API.
 * @returns {Promise<any>} Datos de la respuesta.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const handleResponse = async (response: Response): Promise<any> => {
    // Convierte la respuesta HTTP a JSON.
    const data = await response.json();
    
    // Si la respuesta no es "ok" (por ejemplo, un código de error HTTP), lanza un error.
    if (!response.ok) {
        // Utiliza el mensaje de error proporcionado por la API, o un mensaje genérico si no existe.
        throw new Error(data.message || "Error en la solicitud");
    }
    
    // Devuelve los datos en formato JSON si la respuesta fue exitosa.
    return data;
};