// Importa la constante API_URL desde el archivo de constantes.
// API_URL es la URL base que se utiliza para realizar solicitudes a la API.

import { API_URL } from "@/utils/constast";
import { Comments } from "@/utils/types/types";




/**
 * Función asíncrona que obtiene los comentarios asociados a un ID específico.
 * @param {string} id - ID del recurso (por ejemplo, una tarea) para el cual se buscan los comentarios.
 * @returns {Promise<Comment[]>} Lista de comentarios.
 */
export const getCommentsById = async (id: string): Promise<Comments[]> => {
    try {
        // Realiza una solicitud HTTP a la API, construyendo la URL con el ID proporcionado.
        const response = await fetch(`${API_URL}/comments/comment/${id}`);
        
  

        // Procesa la respuesta y devuelve los datos JSON usando la función auxiliar handleResponse.
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al obtener el comentario: ${error.message}`);
        } else {
            throw new Error("Error al obtener el comentario");
        }
    }
};

export const createComment = async (comment: Partial<Comments>) => {
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
        })

        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al crear el comentario: ${error.message}`);
        } else {
            throw new Error("Error al crear el comentario");
        }
    }
}

export const editComment = async (id: string, comment: Partial<Comments>) => {
    try {
        // Realiza una solicitud HTTP a la API, construyendo la URL con el ID proporcionado.
        const response = await fetch(`${API_URL}/comments/comment/${id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
        })
   
        
  

        // Procesa la respuesta y devuelve los datos JSON usando la función auxiliar handleResponse.
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al editar el comentario: ${error.message}`);
        } else {
            throw new Error("Error al editar el comentario");
        }
    }
}

export const deleteComment = async (id: string) => {
    try {
        // Realiza una solicitud HTTP a la API, construyendo la URL con el ID proporcionado.
        const response = await fetch(`${API_URL}/comments/comment/${id}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
     
        })

        // Procesa la respuesta y devuelve los datos JSON usando la función auxiliar handleResponse.
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar el comentario: ${error.message}`);
        } else {
            throw new Error("Error al eliminar el comentario");
        }
    }
}
/**
 * Función auxiliar que maneja la respuesta de la API.
 * Convierte la respuesta a formato JSON y verifica si la solicitud fue exitosa.
 * @param {Response} response - Respuesta de la API.
 * @returns {Promise<any>} Datos de la respuesta.
 * @throws {Error} Si la respuesta no es exitosa.
 */
const handleResponse = async (response: Response): Promise<any> => {
    // Si la respuesta es 204 No Content, no intentes analizar el JSON
    if (response.status === 204) {
        return null; // Devuelve null o un valor predeterminado
    }

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