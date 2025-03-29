import { API_URL } from "@/utils/constast";
import { ProcessUsers } from "@/utils/types/types";

interface ProcessUsersHandle { 
  processId: string;
  usersId: string[];
}

export const createProcessUsers = async (
  data: ProcessUsersHandle
): Promise<ProcessUsers[]> => {
  try {
    const response = await fetch(`${API_URL}/processUsers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear los usuarios para el proceso: ${error.message}`);
    }
    throw new Error("Error al crear los usuarios para el proceso");
  }
};

export const deleteProcessUser = async (data: { processId: string; userId: string }): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/processUsers`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al eliminar el usuario del proceso: ${error.message}`);
    }
    throw new Error("Error al eliminar el usuario del proceso");
  }
};

const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
};
