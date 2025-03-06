// Importa la constante API_URL desde el archivo de constantes.
import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un tipo de producto
interface ProductType {
    id: string;
    name: string;
    description?: string;
    // Otras propiedades relevantes...
}

/**
 * Obtener todos los tipos de productos.
 * @returns {Promise<ProductType[]>} Lista de tipos de productos.
 */
export const fetchProductTypes = async (): Promise<ProductType[]> => {
    try {
        const response = await fetch(`${API_URL}/typeProducts`);
        if (!response.ok) {
            throw new Error("Error al obtener los tipos de productos");
        }
        const data = await response.json();
        return data;
     } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Crear un nuevo tipo de producto.
 * @param {Omit<ProductType, "id">} productTypeData - Datos del tipo de producto a crear (sin el campo "id").
 * @returns {Promise<ProductType>} Tipo de producto creado.
 */
export const createProductType = async (
    productTypeData: Omit<ProductType, "id">
): Promise<ProductType> => {
    try {
        const response = await fetch(`${API_URL}/typeProducts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productTypeData),
        });

        if (!response.ok) {
            throw new Error("Error al crear el tipo de producto");
        }

        const data = await response.json();
        return data;
     } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Actualizar un tipo de producto.
 * @param {string} id - ID del tipo de producto a actualizar.
 * @param {Partial<ProductType>} productTypeData - Datos del tipo de producto a actualizar.
 * @returns {Promise<ProductType>} Tipo de producto actualizado.
 */
export const updateProductType = async (
    id: string,
    productTypeData: Partial<ProductType>
): Promise<ProductType> => {
    try {
        const response = await fetch(`${API_URL}/typeProducts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productTypeData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el tipo de producto");
        }

        const data = await response.json();
        return data;
     } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};

/**
 * Eliminar un tipo de producto.
 * @param {string} id - ID del tipo de producto a eliminar.
 * @returns {Promise<void>} Respuesta de la API.
 */
export const deleteProductType = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/typeProducts/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el tipo de producto");
        }

        const data = await response.json();
        return data;
     } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error al eliminar cliente: ${error.message}`);
        } else {
            throw new Error("Error al eliminar cliente");
        }
    }
};