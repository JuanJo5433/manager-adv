// Importa la constante API_URL desde el archivo de constantes.
// API_URL representa la URL base que se utiliza para hacer solicitudes a la API.
import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un proceso
interface Process {
    length: number;
    id: string;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    clientId: string;
    createdAt: string;
    // Otras propiedades relevantes...
}


/**
 * Función asíncrona para obtener un proceso específico por su ID.
 * @param {string} id - ID del proceso que se desea obtener.
 * @returns {Promise<Process>} Datos del proceso.
 */
export const getProcessById = async (id: string): Promise<Process> => {
    try {
        // Realiza una solicitud HTTP GET a la API para obtener el proceso con el ID proporcionado.
        const response = await fetch(`${API_URL}/processes/process/${id}`);
        // Muestra en consola la respuesta obtenida para facilitar la depuración.
        console.log("🚀 ~ getProcessById ~ response:", response);

        // Procesa la respuesta y devuelve los datos en formato JSON.
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
    // Convierte la respuesta HTTP a un objeto JSON.
    const data = await response.json();
    // Si la respuesta no es exitosa (response.ok es false), lanza un error con el mensaje proporcionado por la API o uno genérico.
    if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
    }
    // Devuelve los datos JSON obtenidos de la respuesta.
    return data;
};