import React, { useState } from "react";
import { TbWorldWww } from "react-icons/tb";

import Sidebar from "@/components/sidebar/Sidebar";
import Pagination from "@/components/common/Pagination";
import CreateSupplierModal from "@/components/suppliers/CreateSuppliersModal";
import useSuppliersManagment from "../../../hooks/suppliers/useSuppliersManagment";
import DetailsSuppliersModal from "@/components/suppliers/DetailsSuppliersModal";
import DeleteSupplierConfirmationModal from "@/components/suppliers/DeleteSuppliersConfirmationModal";
import EditSupplierModal from "@/components/suppliers/EditSuppliersModel";

const SuppliersPage: React.FC = () => {
    const {
        error,
        searchQuery,
        currentPage,
        totalPages,
        filteredSuppliers,
        refreshSuppliers,
        setSearchQuery,
        setCurrentPage,
    } = useSuppliersManagment();

    const [modalCreateOpen, setModalCreateOpen] = useState<boolean>(false);
    const [modalDetailsOpen, setmodalDetailsOpen] = useState<boolean>(false);
    const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
    const [selectSupplier, setselectSupplier] = useState<any>({});

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="md:ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
                            Gestión de Proveedores
                        </h1>
                        <button
                            onClick={() => setModalCreateOpen(true)}
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
                            Nuevo Proveedor
                        </button>
                    </div>

                    {/* Mensaje de error */}
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
                                        d="M12 9v2m0 4h.01M5.062 20h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 17c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Buscador */}
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
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

                    {/* Tabla */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            "Empresa",
                                            "NIT",
                                            "Nombre del representante",
                                            "Tipo de proveedor",
                                            "Correo",
                                            "Teléfono",
                                            "Enlace",
                                            "Acciones",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSuppliers.map(
                                        (supplier, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {supplier.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {supplier.nit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                                    {
                                                        supplier.nameRepresentative
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {supplier.supplierTypes.map(
                                                        (
                                                            type: any,
                                                            i,
                                                            array
                                                        ) => (
                                                            <span
                                                                key={
                                                                    type.supplierTypeId
                                                                }
                                                                className="text-gray-500 text-sm"
                                                            >
                                                                {type.name}
                                                                {i <
                                                                array.length - 1
                                                                    ? ", "
                                                                    : ""}
                                                            </span>
                                                        )
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {supplier.email}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs text-sm text-gray-600">
                                                    {supplier.phone}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <a
                                                        href={
                                                            supplier.urlWeb ||
                                                            "#"
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                        title="Visitar sitio web"
                                                    >
                                                        <div className="flex justify-center">
                                                            <TbWorldWww
                                                                size={20}
                                                            />
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-4">
                                                        {/* Ver */}
                                                        <button
                                                            className="text-green-600 hover:text-green-900"
                                                            onClick={() => {
                                                                setmodalDetailsOpen(
                                                                    true
                                                                );
                                                                setselectSupplier(
                                                                    supplier
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        {/* Editar */}
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900"
                                                            onClick={() => {
                                                                setModalEditOpen(
                                                                    true
                                                                );
                                                                setselectSupplier(
                                                                    supplier
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </button>
                                                        {/* Eliminar */}
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => {
                                                                setModalDeleteOpen(
                                                                    true
                                                                );
                                                                setselectSupplier(
                                                                    supplier
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para crear proveedor */}
            {modalCreateOpen && (
                <CreateSupplierModal
                    isOpen={modalCreateOpen}
                    onClose={() => setModalCreateOpen(false)}
                    refreshSuppliers={refreshSuppliers}
                />
            )}

            {/* Modal para ver detalles del proveedor */}
            {modalDetailsOpen && (
                <DetailsSuppliersModal
                    onClose={() => setmodalDetailsOpen(false)}
                    supplier={selectSupplier}
                />
            )}
            {/* Modal para editar los datos de un proveedor */}
            {modalEditOpen && (
                <EditSupplierModal
                    isOpen={modalEditOpen}
                    onClose={() => setModalEditOpen(false)}
                    supplier={selectSupplier}
                    refreshSuppliers={refreshSuppliers}
                />
            )}

            {/* Modal para eliminar proveedor */}
            {modalDeleteOpen && (
                <DeleteSupplierConfirmationModal
                    isOpen={modalDeleteOpen}
                    onClose={() => setModalDeleteOpen(false)}
                    supplier={selectSupplier}
                    refreshSuppliers={refreshSuppliers}
                />
            )}
        </div>
    );
};

export default SuppliersPage;
