import { API_URL } from "@/utils/constast";

// Obtener todos los tipos de productos
export const fetchProductTypes = async () => {
    try {
        const response = await fetch(`${API_URL}/typeProducts`);
        if (!response.ok) {
            throw new Error("Error al obtener los tipos de productos");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Crear un nuevo tipo de producto
export const createProductType = async (productTypeData) => {
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
        throw new Error(error.message);
    }
};

// Actualizar un tipo de producto
export const updateProductType = async (id, productTypeData) => {
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
        throw new Error(error.message);
    }
};

// Eliminar un tipo de producto
export const deleteProductType = async (id) => {
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
        throw new Error(error.message);
    }
};