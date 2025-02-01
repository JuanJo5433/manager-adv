import { useState, useEffect } from "react";
import CreateClientModal from "@/components/clients/CreateClientModal";
import DeleteConfirmationModal from "@/components/clients/DeleteConfirmationModal";
import EditClientModal from "@/components/clients/EditClientModal";
import {
    getClients,
    createClient,
    updateClient,
    deleteClient,
} from "@/services/client/clientServices";

const ClientManagement = () => {
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

    // Efecto para cargar los clientes al montar el componente
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

    // Función para crear un nuevo cliente
    const handleCreateClient = async (clientData) => {
        try {
            const newClient = await createClient(clientData);
            setClients([...clients, newClient]);
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para manejar la edición de un cliente
    const handleEditClick = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    // Función para guardar los cambios de un cliente editado
    const handleSaveEdit = async (id, formData) => {
        try {
            const updatedClient = await updateClient(id, formData);
            setClients(clients.map((c) => (c.id === id ? updatedClient : c)));
            setEditModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para manejar la eliminación de un cliente
    const handleDelete = (id) => {
        setSelectedClient(id);
        setDeleteModalOpen(true);
    };

    // Función para confirmar la eliminación de un cliente
    const confirmDelete = async () => {
        try {
            await deleteClient(selectedClient);
            setClients(
                clients.filter((client) => client.id !== selectedClient)
            );
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

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="md:ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
                            Gestión de Clientes
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Nuevo Cliente
                        </button>
                    </div>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center text-red-600">
                                <svg
                                    className="w-5 h-5 mr-2"
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
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar clientes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-gray-600 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg
                                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Documento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Correo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Observaciones
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {client.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">
                                                {client.document}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {client.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs text-gray-600 text-sm">
                                                {client.observation}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                client
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                client.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando{" "}
                                        <span className="font-medium">
                                            {startIndex + 1}-{endIndex}
                                        </span>{" "}
                                        de{" "}
                                        <span className="font-medium">
                                            {clients.length}
                                        </span>{" "}
                                        resultados
                                    </div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.max(1, currentPage - 1)
                                                )
                                            }
                                            className="px-3 py-2 rounded-l-lg border bg-white text-gray-500 hover:bg-gray-50"
                                            disabled={currentPage === 1}
                                        >
                                            Anterior
                                        </button>
                                        {[...Array(totalPages)].map(
                                            (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            index + 1
                                                        )
                                                    }
                                                    className={`px-3 py-2 border ${
                                                        currentPage ===
                                                        index + 1
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.min(
                                                        totalPages,
                                                        currentPage + 1
                                                    )
                                                )
                                            }
                                            className="px-3 py-2 rounded-r-lg border bg-white text-gray-500 hover:bg-gray-50"
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Siguiente
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CreateClientModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateClient}
                />
                <EditClientModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    client={selectedClient}
                    onSave={handleSaveEdit}
                />
                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    clientName={
                        clients.find((c) => c.id === selectedClient)?.name
                    }
                />
            </main>
        </div>
    );
};

export default ClientManagement;
