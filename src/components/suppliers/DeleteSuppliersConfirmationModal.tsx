import { deleteSupplier } from "@/services/suppliers/suppliersServices";
import React from "react";
import { useEffect, type FC } from "react";

// Interface para las props del componente
interface Props {
    isOpen: boolean;
    onClose: () => void;
    supplier?: any; // Hacemos el nombre opcional por si no está disponible
    refreshSuppliers: () => void;
}

/**
 * Modal de confirmación para eliminación de clientes
 * @param isOpen - Controla la visibilidad del modal
 * @param onClose - Función para cerrar el modal
 * @param supplier -Proveedor seleccionado
 * @param refreshSuppliers - Funcion para actualizar la tabla
 */
const DeleteSupplierConfirmationModal: FC<Props> = ({
    isOpen,
    onClose,
    supplier,
    refreshSuppliers,
}) => {

    // Efecto para bloquear el scroll del body cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";

        // Cleanup function para restaurar el scroll al desmontar
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const onConfirm = async () => {
        const response = await deleteSupplier(
            supplier.id,
            supplier.supplierTypes
        );
        if (response) {
            refreshSuppliers();
        } else {
            console.error("Fallo al eliminar");
            refreshSuppliers();

        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <div className="text-center">
                    {/* Icono de advertencia */}
                    <svg
                        className="mx-auto h-12 w-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>

                    {/* Título y descripción */}
                    <h3 className="text-lg font-medium text-gray-900 mt-2">
                        ¿Eliminar Proveedor?
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Estás por eliminar a {supplier?.name ?? "este cliente"}.
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Confirmar Eliminación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSupplierConfirmationModal;
