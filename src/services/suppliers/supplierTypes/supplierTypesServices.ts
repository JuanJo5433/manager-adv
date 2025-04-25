import { API_URL } from "@/utils/constast";

export const getSuppliersTypes = async () => {
    try {
        const response = await fetch(
            `${API_URL}/suppliers/suppliersTypes`
        );

        if (!response.ok) {
            throw new Error(
                `Error al obtener los tipos de proveedor: ${response}`
            );
        }

        const dataType = await response.json();
        

        return {dataType};
    } catch (error) {
        console.error("Error en getSuppliersTypes:", error);
        throw error;
    }
};
