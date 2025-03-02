// Importa la constante API_URL desde el archivo de constantes.
// API_URL es la URL base que se utiliza para realizar solicitudes a la API.
import { API_URL } from "@/utils/constast";

// Función asíncrona que obtiene los comentarios asociados a un ID específico.
// Recibe el parámetro "id" y realiza una petición a la API para recuperar los datos.
export const getCommentsById = async (id) => {
    try {
        // Realiza una solicitud HTTP a la API, construyendo la URL con el ID proporcionado.
        const response = await fetch(`${API_URL}/comments/comment/${id}`);
        
        // Muestra la respuesta en la consola para propósitos de depuración.
        console.log("🚀 ~ getcomments ~ response:", response);

        // Procesa la respuesta y devuelve los datos JSON usando la función auxiliar handleResponse.
        return await handleResponse(response);
    } catch (error) {
        // Si ocurre un error durante la solicitud, lanza una nueva excepción con un mensaje descriptivo.
        throw new Error(`Error al obtener los procesos: ${error.message}`);
    }
};

// Función auxiliar que maneja la respuesta de la API.
// Convierte la respuesta a formato JSON y verifica si la solicitud fue exitosa.
const handleResponse = async (response) => {
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
