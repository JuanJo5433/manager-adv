import { getClients } from "@/services/client/clientServices";
import { getProcessCount } from "@/services/processes/processesServices";
import { Client } from "@/utils/types/types";
import React, { useEffect, useState, useCallback, ChangeEvent, FC } from "react";


interface FormData {
  title: string;
  clientId: string;
  slug: string;
  userId: string;
  status: string;
}

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => void;
}

const CreateProcessModal: FC<CreateProcessModalProps> = ({ isOpen, onClose, onCreate }) => {
  // Estados con tipado explícito
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    clientId: "0",
    slug: "",
    userId: "bd366615-e28e-4406-8b2c-d7a4d7275f9f",
    status: "1",
  });

  // Función para obtener clientes con tipado de retorno
  const fetchClients = async () => {
    const result = await getClients();
    setClients(result as Client[]);
  };

  // Función para generar título con tipado de parámetros
  const generateTitle = useCallback(
    async (clientId: string) => {
      if (!clientId || !clients.length) return "Título generado automáticamente";

      const processCount = await getProcessCount();
      const selectedClient = clients.find((client) => client.id === clientId);

      return selectedClient
        ? `Reserva #${processCount + 1} - ${selectedClient.name}`
        : "Título generado automáticamente";
    },
    [clients]
  );

  useEffect(() => {
    if (isOpen) fetchClients();
  }, [isOpen]);

  useEffect(() => {
    if (formData.clientId) {
      generateTitle(formData.clientId).then((title) => {
        setFormData((prev) => ({ ...prev, title }));
      });
    }
  }, [formData.clientId, generateTitle]);

  // Manejador de cambios con tipado de evento
  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "clientId" ? parseInt(value, 10) : value,
    }));
  };

  // Manejador de submit con tipado de evento
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-900 font-semibold">Nuevo Proceso</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              disabled
              className="w-full text-gray-600 px-3 py-2 border rounded-lg"
              value={formData.title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccione el cliente
            </label>
            <select
              required
              name="clientId"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.clientId}
              onChange={handleChange}
            >
              <option value={-1} disabled>
                Seleccione un cliente
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.document}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Persona asignada
            </label>
            <select
              name="userId"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="1">Empleado 1</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Proceso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProcessModal;