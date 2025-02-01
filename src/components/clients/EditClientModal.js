import { useEffect, useState } from 'react';

const EditClientModal = ({ isOpen, onClose, client, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        document: '',
        phone: '',
        email: '',
        observation: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(client.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full text-gray-700 max-w-md space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Editar Cliente</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input type="text" required className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                            <input type="text" className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.document} onChange={(e) => setFormData({ ...formData, document: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="tel" className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input type="email" className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea className="w-full text-gray-700 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" value={formData.observation} onChange={(e) => setFormData({ ...formData, observation: e.target.value })} />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;