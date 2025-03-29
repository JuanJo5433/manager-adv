// Importa la constante API_URL desde el archivo de constantes.
// API_URL representa la URL base para realizar solicitudes a la API.
import { API_URL } from "@/utils/constast";
import { Task } from "@/utils/types/types";


export const createTask = async (taskData: Omit<Task, "id"| "process"| "user"| "comments" | "createdAt">) => {
    try {
        // Realiza una petición HTTP POST a la ruta /tasks de la API.
        const response = await fetch(`${API_URL}/processes/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });
        console.log("🚀 ~ createTask ~ response:", response)

        // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al crear la tarea: ${error.message}`);
        } else {
            throw new Error("Error al crear la tarea");
        }
    }
};

export const editTask = async(taskDataUpdate: Partial<Task>)=>{
    try {
                // Realiza una petición HTTP POST a la ruta /tasks de la API.
                const response = await fetch(`${API_URL}/processes/tasks`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(taskDataUpdate),
                });
                console.log("🚀 ~ editTask ~ response:", response)
        
                // Llama a la función handleResponse para procesar la respuesta y devolver los datos en formato JSON.
                return await handleResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al editar la tarea: ${error.message}`);
        } else {
            throw new Error("Error al editar la tarea");
        }
    }
}
// Función auxiliar que maneja la respuesta de la API.
// Convierte la respuesta a JSON y verifica si la solicitud fue exitosa.
const handleResponse = async (response: Response) => {
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
