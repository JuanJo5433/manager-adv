import { useState, useEffect, useMemo } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/client/clientServices";
import { Client } from "@/utils/types/types";

// Configuración de paginación
const ITEMS_PER_PAGE = 5;

interface UseClientManagement {
  clients: Client[];
  isModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedClient: Client | null;
  searchQuery: string;
  currentPage: number;
  error: string;
  totalPages: number;
  filteredClients: Client[];
  setIsModalOpen: (value: boolean) => void;
  setEditModalOpen: (value: boolean) => void;
  setDeleteModalOpen: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (value: number) => void;
  handleCreateClient: (clientData: Omit<Client, "id">) => Promise<void>;
  handleEditClick: (client: Client) => void;
  handleSaveEdit: (id: string, formData: Partial<Client>) => Promise<void>;
  handleDelete: (id: string) => void;
  confirmDelete: () => Promise<void>;
}

/**
 * Hook personalizado para la gestión completa de clientes
 * Maneja fetching de datos, paginación, búsqueda y operaciones CRUD
 */
const useClientManagement = (): UseClientManagement => {
  // Estados principales
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados de modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  /**
   * Calcula el número total de páginas basado en los items filtrados
   * Actualiza automáticamente cuando cambian los clientes
   */
  const totalPages = useMemo(() => (
    Math.ceil(clients.length / ITEMS_PER_PAGE)
  ), [clients.length]);

  /**
   * Filtra y pagina los clientes según la búsqueda y página actual
   * Optimizado con useMemo para evitar recálculos innecesarios
   */
  const filteredClients = useMemo(() => {
    // Filtrado por query de búsqueda
    const filtered = clients.filter(client =>
      Object.values(client).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
    ));
    
    // Paginación
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [clients, searchQuery, currentPage]);

  // Efecto para cargar clientes iniciales
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        handleError(error, "Error al cargar clientes");
      }
    };
    
    fetchClients();
  }, []);

  /** Maneja errores de forma consistente */
  const handleError = (error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    setError(message);
    console.error(message, error);
  };

  /** Crea un nuevo cliente y actualiza el estado */
  const handleCreateClient = async (clientData: Omit<Client, "id">) => {
    try {
      const newClient = await createClient(clientData);
      setClients(prev => [...prev, newClient]);
      setIsModalOpen(false);
    } catch (error) {
      handleError(error, "Error al crear cliente");
    }
  };

  /** Prepara el cliente para edición y abre el modal */
  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  /** Actualiza un cliente existente y refresca la lista */
  const handleSaveEdit = async (id: string, formData: Partial<Client>) => {
    try {
      const updatedClient = await updateClient(id, formData);
      setClients(prev => 
        prev.map(c => c.id === id ? { ...c, ...updatedClient } : c)
      );
      setEditModalOpen(false);
    } catch (error) {
      handleError(error, "Error al actualizar cliente");
    }
  };

  /** Prepara la eliminación mostrando el modal de confirmación */
  const handleDelete = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id) || null;
    setSelectedClient(clientToDelete);
    setDeleteModalOpen(true);
  };

  /** Confirma y ejecuta la eliminación del cliente */
  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setDeleteModalOpen(false);
      
      // Resetear paginación si es necesario
      if (filteredClients.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      handleError(error, "Error al eliminar cliente");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return {
    clients,
    isModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedClient,
    searchQuery,
    currentPage,
    error,
    totalPages,
    filteredClients,
    setIsModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setSearchQuery,
    setCurrentPage,
    handleCreateClient,
    handleEditClick,
    handleSaveEdit,
    handleDelete,
    confirmDelete,
  };
};

export default useClientManagement;