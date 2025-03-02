// Importa la constante API_URL desde el archivo de constantes.
// API_URL representa la URL base para realizar solicitudes a la API.
import { API_URL } from "@/utils/constast";

// Función asíncrona para obtener todos los procesos desde la API.
export const getProccesses = async () => {
    try {
        // Realiza una petición HTTP GET a la ruta /proccesses de la API.
        const response = await fetch(`${API_URL}/proccesses`);
        // Muestra la respuesta en la consola para facilitar la depuración.
        console.log("🚀 ~ getProccesses ~ response:", response);

        // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
        return await handleResponse(response);
    } catch (error) {
        // En caso de error, lanza una nueva excepción con un mensaje descriptivo.
        throw new Error(`Error al obtener los procesos: ${error.message}`);
    }
};

// Función auxiliar que maneja la respuesta de la API.
// Convierte la respuesta a JSON y verifica si la solicitud fue exitosa.
const handleResponse = async (response) => {
    // Convierte el cuerpo de la respuesta en formato JSON.
    const data = await response.json();
    // Si la respuesta HTTP no indica éxito (response.ok es false), lanza un error.
    if (!response.ok) {
        // Se utiliza el mensaje de error proporcionado por la API o un mensaje genérico.
        throw new Error(data.message || "Error en la solicitud");
    }
    // Devuelve los datos JSON si la respuesta fue exitosa.
    return data;
};
