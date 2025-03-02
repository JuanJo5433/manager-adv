// Importa la constante API_URL desde el archivo de constantes.
// API_URL representa la URL base que se utiliza para hacer solicitudes a la API.
import { API_URL } from "@/utils/constast";

// Función asíncrona para obtener un proceso específico por su ID.
// Recibe el parámetro "id" y realiza una petición a la ruta `/proccesses/procces/${id}`.
export const getProccesById = async (id) => {
    try {
        // Realiza una solicitud HTTP GET a la API para obtener el proceso con el ID proporcionado.
        const response = await fetch(`${API_URL}/proccesses/procces/${id}`);
        // Muestra en consola la respuesta obtenida para facilitar la depuración.
        console.log("🚀 ~ getProccesses ~ response:", response);

        // Procesa la respuesta y devuelve los datos en formato JSON.
        return await handleResponse(response);
    } catch (error) {
        // En caso de error, lanza una excepción con un mensaje descriptivo.
        throw new Error(`Error al obtener los procesos: ${error.message}`);
    }
};

// Función auxiliar que maneja la respuesta de la API.
// Convierte la respuesta a JSON y verifica si la solicitud fue exitosa.
const handleResponse = async (response) => {
    // Convierte la respuesta HTTP a un objeto JSON.
    const data = await response.json();
    // Si la respuesta no es exitosa (response.ok es false), lanza un error con el mensaje proporcionado por la API o uno genérico.
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    // Devuelve los datos JSON obtenidos de la respuesta.
    return data;
};
