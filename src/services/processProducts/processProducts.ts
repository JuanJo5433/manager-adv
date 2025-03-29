import { API_URL } from "@/utils/constast";
import { processProducts } from "@/utils/types/types";

interface ProcessProductsHandle { 
  processId: string;
  productsId: string[];
}

export const createProcessProducts = async (
  data: ProcessProductsHandle
): Promise<processProducts[]> => {
  try {
    const response = await fetch(`${API_URL}/processProducts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear los productos para el proceso: ${error.message}`);
    }
    throw new Error("Error al crear los productos para el proceso");
  }
};

export const deleteProcessProduct = async (data: { processId: string; productId: string }): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/processProducts`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al eliminar el producto del proceso: ${error.message}`);
    }
    throw new Error("Error al eliminar el producto del proceso");
  }
};

const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
};
