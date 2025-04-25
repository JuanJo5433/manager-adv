import React from "react";
import { TbX } from "react-icons/tb";
import {
    HiOutlinePhone,
    HiOutlineMail,
    HiOutlineGlobeAlt,
    HiOutlineUser,
    HiOutlineIdentification,
} from "react-icons/hi";

interface Props {
    onClose: () => void;
    supplier: any;
}

const DetailsSuppliersModal: React.FC<Props> = ({ onClose, supplier }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Detalles del Proveedor
                    </h2>
                    <button
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-100"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <TbX className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 divide-y divide-gray-200 space-y-6">
                    {/* Nombre y Representante */}
                    <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-800">
                            {supplier.name}
                        </p>
                        <div className="flex items-center text-gray-600 gap-2">
                            <HiOutlineUser className="w-5 h-5" />
                            <span>
                                <strong>Representante:</strong>{" "}
                                {supplier.nameRepresentative || "No definido"}
                            </span>
                        </div>
                    </div>

                    {/* Info general */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <HiOutlineIdentification className="w-5 h-5" />
                                <span>
                                    <strong>NIT:</strong> {supplier.nit}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <HiOutlinePhone className="w-5 h-5" />
                                <span>
                                    <strong>Teléfono:</strong>{" "}
                                    {supplier.phone || "No disponible"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <HiOutlineMail className="w-5 h-5" />
                                <span>
                                    <strong>Email:</strong>{" "}
                                    {supplier.email || "No disponible"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <HiOutlineGlobeAlt className="w-5 h-5" />
                                <span>
                                    <strong>Web:</strong>{" "}
                                    {supplier.urlWeb || "No disponible"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tipos de proveedor */}
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Servicios del proveedor
                        </h3>
                        <ul className="list-disc list-inside text-gray-800">
                            {supplier.supplierTypes?.length > 0 ? (
                                supplier.supplierTypes.map((type: any) => (
                                    <li key={type.id}>{type.name}</li>
                                ))
                            ) : (
                                <li>No especificados</li>
                            )}
                        </ul>
                    </div>

                    {/* Descripción */}
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Descripción
                        </h3>
                        <p className="text-gray-800">
                            {supplier.description &&
                            supplier.description !== "SIN DESCRIPCION"
                                ? supplier.description
                                : "Sin descripción"}
                        </p>
                    </div>
                    {/* Condiciones especiales */}
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Condiciones especiales
                        </h3>
                        <p className="text-gray-800">
                            {supplier.conditions &&
                            supplier.conditions !== "SIN CONDICIONES ESPECIALES"
                                ? supplier.conditions
                                : "Sin condiciones especiales"}
                        </p>
                    </div>
                    {/* Fechas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">
                                Creado el
                            </h3>
                            <p className="text-gray-700">
                                {new Date(supplier.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">
                                Última actualización
                            </h3>
                            <p className="text-gray-700">
                                {new Date(supplier.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsSuppliersModal;
