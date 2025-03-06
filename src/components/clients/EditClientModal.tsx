import { Client } from '@/utils/types/types';
import React from 'react';
import { useEffect, useState, type FormEvent, type ChangeEvent, type FC } from 'react';


interface FormData {
  name: string;
  document: string;
  phone: string;
  email: string;
  observation: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: FormData) => Promise<void>;
  client: Client;
}

/**
 * Modal de edición de clientes
 * @param isOpen - Controla la visibilidad del modal
 * @param onClose - Función para cerrar el modal
 * @param onSave - Función para guardar los cambios
 * @param client - Datos del cliente a editar
 */
const EditClientModal: FC<Props> = ({ isOpen, onClose, onSave, client }) => {
  // Estado del formulario con tipado explícito
  const [formData, setFormData] = useState<FormData>({
    name: '',
    document: '',
    phone: '',
    email: '',
    observation: ''
  });

  // Efecto para cargar datos del cliente al abrir el modal
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        document: client.document || '',
        phone: client.phone || '',
        email: client.email || '',
        observation: client.observation || ''
      });
    }
  }, [client]);

  // Manejo del envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (client) {
        await onSave(client.id.toString(), formData);
        onClose();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // Manejo unificado de cambios en los campos
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full text-gray-700 max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Campos Documento y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento
              </label>
              <input
                type="text"
                name="document"
                className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.document}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.email}
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
              className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.observation}
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;