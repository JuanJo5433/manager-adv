// Importa la constante API_URL desde el archivo de constantes, que define la URL base de la API.
import { API_URL } from "@/utils/constast";

// Función asíncrona para obtener la información de un usuario por su ID.
// Recibe el parámetro "id" y realiza una petición a la ruta correspondiente en la API.
export const getUserById = async (id) => {
    try {
        // Realiza una petición HTTP GET a la API para obtener el usuario con el ID especificado.
        const response = await fetch(`${API_URL}/users/user/${id}`);
        
        // Imprime en consola la respuesta recibida para fines de depuración.
        console.log("🚀 ~ getusers ~ response:", response);

        // Procesa la respuesta y devuelve los datos en formato JSON utilizando la función handleResponse.
        return await handleResponse(response);
    } catch (error) {
        // Si ocurre algún error durante la petición, se lanza una nueva excepción con un mensaje descriptivo.
        throw new Error(`Error al obtener los procesos: ${error.message}`);
    }
};

// Función auxiliar que maneja la respuesta de la API.
// Convierte la respuesta a JSON y verifica si la solicitud fue exitosa.
const handleResponse = async (response) => {
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
