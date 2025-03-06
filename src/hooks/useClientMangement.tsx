import { useState, useEffect, useMemo } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/client/clientServices";
import { Client } from "@/utils/types/types";

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

const useClientManagement = (): UseClientManagement => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const itemsPerPage = 5;
  
  const totalPages = useMemo(() => Math.ceil(clients.length / itemsPerPage), [clients.length]);

  const filteredClients = useMemo(() => {
    const filtered = clients.filter(client =>
      Object.values(client).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [clients, searchQuery, currentPage]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };
    fetchClients();
  }, []);

  const handleCreateClient = async (clientData: Omit<Client, "id">) => {
    try {
      const newClient = await createClient(clientData);
      setClients(prev => [...prev, newClient]);
      setIsModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear cliente");
    }
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, formData: Partial<Client>) => {
    try {
      const updatedClient = await updateClient(id, formData);
      setClients(prev => 
        prev.map(c => c.id === id ? { ...c, ...updatedClient } : c)
      );
      setEditModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al actualizar");
    }
  };

  const handleDelete = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id) || null;
    setSelectedClient(clientToDelete);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setDeleteModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al eliminar");
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
