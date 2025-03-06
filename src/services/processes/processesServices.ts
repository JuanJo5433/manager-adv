// Importa la constante API_URL desde el archivo de constantes.
// API_URL representa la URL base para realizar solicitudes a la API.
import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un proceso
interface Process {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    clientId: string;
    createdAt: string;
    // Otras propiedades relevantes...
}



/**
 * Función asíncrona para obtener todos los procesos desde la API.
 * @returns {Promise<Process[]>} Lista de procesos.
 */
export const getProcesses = async (): Promise<Process[]> => {
    try {
        // Realiza una petición HTTP GET a la ruta /processes de la API.
        const response = await fetch(`${API_URL}/processes`);
        // Muestra la respuesta en la consola para facilitar la depuración.
        console.log("🚀 ~ getProcesses ~ response:", response);

        // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
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
 * Función asíncrona para crear un nuevo proceso en la API.
 * @param {Omit<Process, "id">} data - Datos del proceso a crear (sin el campo "id").
 * @returns {Promise<Process>} Proceso creado.
 */
export const createProcess = async (data: Omit<Process, "id">): Promise<Process> => {
    console.log("🚀 ~ createProcess ~ data:", data);
    try {
        // Realiza una petición HTTP POST a la ruta /processes de la API.
        const response = await fetch(`${API_URL}/processes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
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
 * Función asíncrona para obtener la cantidad de procesos desde la API.
 * @returns {Promise<number>} Cantidad de procesos.
 */
export const getProcessCount = async (): Promise<number> => {
    try {
        // Realiza una petición HTTP GET a la ruta /processes/count de la API.
        const response = await fetch(`${API_URL}/processes?count=true`);
        // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
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