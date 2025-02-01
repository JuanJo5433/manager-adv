import { useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, clientName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mt-2">¿Eliminar cliente?</h3>
                    <p className="text-sm text-gray-500 mt-2">Estás por eliminar a {clientName || 'este cliente'}. Esta acción no se puede deshacer.</p>
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Confirmar Eliminación</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;