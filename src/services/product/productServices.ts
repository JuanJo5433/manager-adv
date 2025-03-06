// Importa la constante API_URL desde el archivo de constantes.
// Asegúrate de que API_URL apunte a "/api/products".
import { API_URL } from "@/utils/constast";

// Define el tipo de datos para un producto
interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount?: number;
    imageUrl?: string;
    availability: boolean;
    productTypeId: string;
    // Otras propiedades relevantes...
}

/**
 * Obtener todos los productos.
 * @returns {Promise<Product[]>} Lista de productos.
 */
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Error al obtener productos");
        return await response.json();
    } catch (error) {
        console.error("Error en getProducts:", error);
        throw error;
    }
};

/**
 * Crear un nuevo producto.
 * @param {Omit<Product, "id">} productData - Datos del producto a crear (sin el campo "id").
 * @returns {Promise<Product>} Producto creado.
 */
export const createProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
    console.log("🚀 ~ createProduct ~ productData:", productData);
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
        console.log(response);

        if (!response.ok) throw new Error("Error al crear producto");
        return await response.json();
    } catch (error) {
        console.error("Error en createProduct:", error);
        throw error;
    }
};

/**
 * Actualizar un producto.
 * @param {string} id - ID del producto a actualizar.
 * @param {Partial<Product>} productData - Datos del producto a actualizar.
 * @returns {Promise<Product>} Producto actualizado.
 */
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("Error al actualizar producto");
        return await response.json();
    } catch (error) {
        console.error("Error en updateProduct:", error);
        throw error;
    }
};

/**
 * Eliminar un producto (soft delete).
 * @param {string} id - ID del producto a eliminar.
 * @returns {Promise<void>} Respuesta de la API.
 */
export const deleteProduct = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/products?id=${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Error al eliminar producto");
        return await response.json();
    } catch (error) {
        console.error("Error en deleteProduct:", error);
        throw error;
    }
};