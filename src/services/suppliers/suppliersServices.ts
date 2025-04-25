import { API_URL } from "@/utils/constast";

export const getSuppliers = async () => {
    try {
        // Realiza la petición HTTP GET
        const response = await fetch(`${API_URL}/suppliers`);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los proveedores");
        }

        // Convierte la respuesta a JSON
        const dataSupplier = await response.json();

        // Si existen supplierTypes, obtenemos su información en paralelo
        if (dataSupplier.length > 0) {
            await Promise.all(
                dataSupplier.map(async (supplier: any) => {
                    if (supplier.supplierTypes) {
                        supplier.supplierTypes = await Promise.all(
                            supplier.supplierTypes.map(async (type: any) => {
                                if (!type.supplierTypeId) {
                                    return { ...type, supplierType: null };
                                }

                                try {
                                    const response = await fetch(
                                        `${API_URL}/suppliers/suppliersTypes/supplierType/${type.supplierTypeId}`
                                    );

                                    if (!response.ok) {
                                        throw new Error(
                                            `Error al obtener el tipo de proveedor: ${type.supplierTypeId}`
                                        );
                                    }

                                    const dataType = await response.json();
                                    return {
                                        ...type,
                                        name: dataType[0]?.name || null,
                                    };
                                } catch (error) {
                                    console.error(
                                        "Error al obtener el tipo de proveedor:",
                                        error
                                    );
                                    return { ...type, supplierType: null };
                                }
                            })
                        );
                    }
                })
            );
        }

        return dataSupplier;
    } catch (error) {
        console.error("Error en getSuppliers:", error);
        throw error;
    }
};

export const createSupplier = async (
    supplierData: any,
    supplierTypeIds: string[]
) => {
    try {
        const response = await fetch(`${API_URL}/suppliers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...supplierData,
            }),
        });
        if (!response.ok) {
            throw new Error("Error al crear el proveedor");
        }
        const data = await response.json();

        const responseSupplierType = await Promise.all(
            supplierTypeIds.map(async (supplierTypeId) => {
                const response = await fetch(
                    `${API_URL}/suppliers/suppliersSupplierTypes`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            supplierId: data.id,
                            supplierTypeId,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error al asociar tipo ${supplierTypeId}`);
                }

                return response.json(); // por si necesitas algo de respuesta
            })
        );

        return { data, responseSupplierType };
    } catch (error) {
        console.error("Error al crear el proveedor:", error);
        throw error;
    }
};

export const editSupplier = async (
    id: string,
    newData: any,
    supplierTypes: any[]
) => {
    try {
        const responseSupplierEdit = await fetch(
            `${API_URL}/suppliers?id=${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    newData,
                ),
            }
        );
        if (!responseSupplierEdit.ok) {
            console.error("Error editando el proveedor");
        }
        const responseSupplierTypeEdit = await fetch(
            `${API_URL}/suppliers/suppliersSupplierTypes/?id=${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    supplierTypes,
                }),
            }
        );
        if (!responseSupplierTypeEdit.ok) {
            console.error("Error editando los tipos de proveedor");
        }
        return { responseSupplierEdit, responseSupplierTypeEdit };
    } catch (error) {
        console.error("Error al editar el proveedor:", error);
        throw error;
    }
};

export const deleteSupplier = async (
    idSupplier: string,
    typesSuppliers: any[]
): Promise<boolean> => {
    try {
        const responseSupplierDelete = await fetch(
            `${API_URL}/suppliers?id=${idSupplier}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!responseSupplierDelete.ok) {
            throw new Error("Error al eliminar el proveedor");
        }

        await Promise.all(
            typesSuppliers.map(async (type) => {
                await fetch(
                    `${API_URL}/suppliers/suppliersSupplierTypes?id=${type.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            })
        );

        return true;
    } catch (error) {
        console.error("Error al eliminar el proveedor o sus tipos:", error);
        throw error;
    }
};
