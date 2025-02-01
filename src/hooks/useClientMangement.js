// src/hooks/useClientManagement.js
import { useState, useEffect } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/client/clientServices";

const useClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Cargar clientes al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchClients();
  }, []);

  // Crear un nuevo cliente
  const handleCreateClient = async (clientData) => {
    try {
      const newClient = await createClient(clientData);
      setClients([...clients, newClient]);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Manejar la edición de un cliente
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  // Guardar los cambios de un cliente editado
  const handleSaveEdit = async (id, formData) => {
    try {
      const updatedClient = await updateClient(id, formData);
      setClients(clients.map((c) => (c.id === id ? updatedClient : c)));
      setEditModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Manejar la eliminación de un cliente
  const handleDelete = (id) => {
    setSelectedClient(id);
    setDeleteModalOpen(true);
  };

  // Confirmar la eliminación de un cliente
  const confirmDelete = async () => {
    try {
      await deleteClient(selectedClient);
      setClients(clients.filter((client) => client.id !== selectedClient));
      setDeleteModalOpen(false);
    } catch (error) {
      setError(error.message);
      setDeleteModalOpen(false);
    }
  };

  // Filtrar clientes basados en la búsqueda
  const filteredClients = clients
    .filter((client) =>
      Object.values(client).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .slice(startIndex, endIndex);

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
    startIndex,
    endIndex,
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