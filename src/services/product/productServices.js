import { API_URL } from "@/utils/constast"; // Asegúrate de que API_URL apunte a "/api/products"

/**
 * Obtener todos los productos
 */
export const getProducts = async () => {
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
 * Crear un nuevo producto
 */
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Error al crear producto");
    return await response.json();
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
  }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (id, productData) => {
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
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (id) => {
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