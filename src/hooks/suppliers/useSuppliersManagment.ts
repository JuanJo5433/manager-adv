import { Suppliers } from "../../utils/types/types";
import { getSuppliers } from "@/services/suppliers/suppliersServices";
import { useEffect, useMemo, useState } from "react";

// Define el contrato del hook personalizado para gestión de proveedores
interface UseSuppliersManagement {
    searchQuery: string; // Texto de búsqueda ingresado por el usuario
    currentPage: number; // Página actual para paginación
    error: string; // Mensaje de error (si ocurre)
    totalPages: number; // Total de páginas disponibles según la data filtrada
    filteredSuppliers: Suppliers[]; // Proveedores ya filtrados y paginados
    refreshSuppliers: () => void; // Función para refrescar la lista de proveedores
    setCurrentPage: (value: number) => void; // Setter para cambiar de página
    setSuppliers: (value: Suppliers[]) => void; // Setter para actualizar la lista de proveedores
    setError: (value: string) => void; // Setter para manejar errores manualmente
    setSearchQuery: (value: string) => void; // Setter para actualizar búsqueda
}

/**
 * Hook personalizado que gestiona la lógica de proveedores:
 * - Fetch de proveedores desde un servicio externo
 * - Búsqueda por texto libre
 * - Paginación dinámica
 */
const useSuppliersManagement = (): UseSuppliersManagement => {
    // Estado para página actual
    const [currentPage, setCurrentPage] = useState(1);

    // Estado para errores de carga o búsqueda
    const [error, setError] = useState("");

    // Estado para el texto de búsqueda ingresado por el usuario
    const [searchQuery, setSearchQuery] = useState("");

    // Lista completa de proveedores (sin filtrar)
    const [suppliers, setSuppliers] = useState<Suppliers[]>([]);

    const fetchSuppliers = async () => {
        try {
            const response = await getSuppliers();
            setSuppliers(response); // Se guarda la data recibida
        } catch (error) {
            // Se maneja el error de forma segura
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error desconocido");
            }
        }
    };
    const refreshSuppliers = () => fetchSuppliers();
    // Hook de efecto que carga los proveedores una única vez al montar el componente
    useEffect(() => {
        const abortController = new AbortController();


        fetchSuppliers();

        // Limpieza del efecto para abortar la solicitud si el componente se desmonta
        return () => {
            abortController.abort();
        };
    }, []);

    // Constante para definir cuántos ítems se mostrarán por página
    const ITEMS_PER_PAGE = 5;

    /**
     * Cálculo memoizado del total de páginas basado en la cantidad total de proveedores.
     * Esto evita que se recalculen innecesariamente en cada render.
     */
    const totalPages = useMemo(
        () => Math.ceil(suppliers.length / ITEMS_PER_PAGE),
        [suppliers.length]
    );

    /**
     * Filtra los proveedores según el texto de búsqueda.
     * Luego aplica paginación sobre el resultado.
     */
    const filteredSuppliers = useMemo(() => {
        // Filtrado basado en coincidencia con cualquier propiedad del proveedor
        const filtered = suppliers.filter(supplier =>
            Object.values(supplier).some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

        // Si el filtro reduce el total de páginas y la actual ya no es válida, vuelve a la página 1
        if (currentPage > 1 && filtered.length < (currentPage - 1) * ITEMS_PER_PAGE) {
            setCurrentPage(1);
        }

        // Cálculo de los índices para paginar
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [suppliers, searchQuery, currentPage]);

    // Retorna todos los valores y funciones que el componente que use este hook pueda necesitar
    return {
        searchQuery,
        currentPage,
        error,
        totalPages,
        filteredSuppliers,
        refreshSuppliers,
        setSuppliers,
        setCurrentPage,
        setError,
        setSearchQuery
    };
};

export default useSuppliersManagement;
