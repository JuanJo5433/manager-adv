import React from "react";
import { useState, type FormEvent, type ChangeEvent } from "react";

// Interface para el estado del formulario
interface FormData {
  name: string ;
  document: string | null;
  phone: string | null;
  email: string | null;
  observation: string | null;
}

// Interface para las props del componente
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => void;
}

/**
 * Componente modal para creación de clientes
 * @param isOpen - Booleano que controla la visibilidad del modal
 * @param onClose - Función para cerrar el modal
 * @param onCreate - Función que se ejecuta al enviar el formulario
 */
const CreateClientModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  // Estado del formulario con tipo explícito
  const [formData, setFormData] = useState<FormData>({
    name: "",
    document: "",
    phone: "",
    email: "",
    observation: "",
  });

  // Maneja el envío del formulario con tipo de evento específico
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  // Actualiza el estado del formulario con tipado seguro
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-900 font-semibold">Nuevo Cliente</h2>
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
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full text-gray-600 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de documento
            </label>
            <input
              type="text"
              name="document"
              required
              className="w-full text-gray-600 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.document ?? ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              required
              className="w-full text-gray-600 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.phone ?? ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full text-gray-600 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.email ?? ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              name="observation"
              className="w-full text-gray-600 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.observation ?? ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Botones de acción */}
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
              Crear Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClientModal;