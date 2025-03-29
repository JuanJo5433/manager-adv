import { FC, useEffect, useState, useCallback, ChangeEvent } from "react";
import Select from "react-select";

import { Client, Products, Users } from "@/utils/types/types";
import { getClients } from "@/services/client/clientServices";
import { getUsers } from "@/services/users/userService";
import { getProducts } from "@/services/product/productServices";
import { getProcessCount } from "@/services/processes/processesServices";
import { createProcessUsers } from "@/services/processUsers/processUsers";
import { createProcessProducts } from "@/services/processProducts/processProducts";

interface ProcessFormData {
  title: string;
  clientId: string;
  slug: string;
  status: number;
}

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: ProcessFormData) => Promise<string>;
}

type SelectOption<T = string> = { value: T; label: string };

const CreateProcessModal: FC<CreateProcessModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  // Estados
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProcessFormData>({
    title: "",
    clientId: "-1",
    slug: "",
    status: 0,
  });

  // Memoizar transformación de datos para Select
  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name || user.username || ""
  }));

  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} - ${product.productType?.name || ''}`
  }));

  // Fetch inicial de datos
  const fetchInitialData = useCallback(async () => {
    try {
      const [clientsData, usersData, productsData] = await Promise.all([
        getClients(),
        getUsers(),
        getProducts()
      ]);
      
      setClients(clientsData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, []);

  // Generar título y slug
  const generateTitleAndSlug = useCallback(
    async (clientId: string) => {
      if (!clientId || clients.length === 0) return "";
      
      try {
        const [processCount, client] = await Promise.all([
          getProcessCount(),
          clients.find(c => c.id === clientId)
        ]);

        return client 
          ? `Reserva #${processCount + 1} - ${client.name}`
          : "";
      } catch (error) {
        console.error("Error generating title:", error);
        return "";
      }
    },
    [clients]
  );

  // Efectos
  useEffect(() => {
    if (isOpen) fetchInitialData();
  }, [isOpen, fetchInitialData]);

  useEffect(() => {
    const updateTitleAndSlug = async () => {
      if (formData.clientId && formData.clientId !== "-1") {
        const title = await generateTitleAndSlug(formData.clientId);
        setFormData(prev => ({
          ...prev,
          title,
          slug: title.trim().replace(/\s+/g, "-").toLowerCase(),
        }));
      }
    };
    
    updateTitleAndSlug();
  }, [formData.clientId, generateTitleAndSlug]);

  // Manejadores de eventos
  const handleSelectChange = (name: keyof ProcessFormData) => 
    (e: ChangeEvent<HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [name]: e.target.value }));
    };

  const handleUserSelection = (options: readonly SelectOption[]) => {
    setSelectedUserIds(options.map(opt => opt.value));
  };

  const handleProductSelection = (options: readonly SelectOption[]) => {
    setSelectedProductIds(options.map(opt => opt.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const processId = await onCreate(formData);
      
      if (processId) {
        await Promise.all([
          createProcessUsers({
            processId,
            usersId: selectedUserIds
          }),
          createProcessProducts({
            processId,
            productsId: selectedProductIds
          })
        ]);
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating process:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-900 font-semibold">Nuevo Proceso</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
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
            <h2 className="block text-base font-medium text-gray-700 mb-1">
              {formData.title || "Nuevo proceso"}
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccione el cliente
            </label>
            <select
              required
              name="clientId"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.clientId}
              onChange={handleSelectChange("clientId")}
            >
              <option value="-1" disabled>Seleccione un cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.document}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personas asignadas
            </label>
            <Select
              options={userOptions}
              isMulti
              onChange={handleUserSelection}
              classNamePrefix="react-select"
              placeholder="Seleccionar usuarios..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Productos
            </label>
            <Select
              options={productOptions}
              isMulti
              onChange={handleProductSelection}
              classNamePrefix="react-select"
              placeholder="Seleccionar productos..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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