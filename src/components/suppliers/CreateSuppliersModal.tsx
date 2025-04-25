import { createSupplier } from "@/services/suppliers/suppliersServices";
import { getSuppliersTypes } from "@/services/suppliers/supplierTypes/supplierTypesServices";
import { SupplierType } from "@/utils/types/types";
import React, {
    useState,
    type FormEvent,
    type ChangeEvent,
    useMemo,
    useEffect,
} from "react";
import {
    TbX,
    TbWorldWww,
    TbPhone,
    TbMail,
    TbUser,
    TbNote,
    TbCategory,
} from "react-icons/tb";
import Select from "react-select";

interface FormData {
    name: string;
    nameRepresentative: string;
    description: string;
    nit: string;
    email: string;
    phone: string;
    urlWeb: string;
    conditions: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    refreshSuppliers: () => void;
}

type SelectOption<T = string> = { value: T; label: string };

const CreateSupplierModal: React.FC<Props> = ({ isOpen, onClose, refreshSuppliers }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        nameRepresentative: "",
        description: "",
        nit: "",
        email: "",
        phone: "",
        urlWeb: "",
        conditions: "",
    });

    const [supplierTypes, setSupplierTypes] = useState<SupplierType[]>([]);
    const [selectedSuppliersId, setSelectedSuppliersId] = useState<string[]>(
        []
    );

    useEffect(() => {
        const fetchSupplierTypes = async () => {
            try {
                const response = await getSuppliersTypes();
                setSupplierTypes(response.dataType);
            } catch (error) {
                console.error("Error fetching supplier types:", error);
            }
        };
        fetchSupplierTypes();
    }, [isOpen]);

    const typeSuppliersOptions = useMemo(
        () =>
            supplierTypes.map((type) => ({
                value: type.id,
                label: type.name || "Sin nombre",
            })),
        [supplierTypes]
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createSupplier(formData, selectedSuppliersId);
        refreshSuppliers();
        onClose();
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSupplierSelection = (options: readonly SelectOption[]) => {
        setSelectedSuppliersId(options.map((opt) => opt.value));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Nuevo Proveedor
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        aria-label="Cerrar modal"
                    >
                        <TbX className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre del Proveedor */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <TbUser className="w-4 h-4 text-gray-500" />
                                Nombre del proveedor *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Representante */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <TbUser className="w-4 h-4 text-gray-500" />
                                Representante
                            </label>
                            <input
                                type="text"
                                name="nameRepresentative"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                                value={formData.nameRepresentative}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <TbNote className="w-4 h-4 text-gray-500" />
                            Descripción *
                        </label>
                        <textarea
                            name="description"
                            rows={2}
                            required
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* NIT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <TbNote className="w-4 h-4 text-gray-500" />
                            NIT *
                        </label>
                        <input
                            type="text"
                            name="nit"
                            required
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                            value={formData.nit}
                            onChange={handleInputChange}
                            placeholder="900123456-7"
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <TbMail className="w-4 h-4 text-gray-500" />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <TbPhone className="w-4 h-4 text-gray-500" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Supplier Type Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <TbCategory className="w-4 h-4 text-gray-500" />
                            Tipo de proveedor *
                        </label>
                        <Select
                            required
                            options={typeSuppliersOptions}
                            onChange={handleSupplierSelection}
                            placeholder="Seleccionar tipo..."
                            isSearchable
                            isMulti
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: "44px",
                                    borderRadius: "0.5rem",
                                    borderColor: "#e5e7eb",
                                    "&:hover": { borderColor: "#93c5fd" },
                                    "&:focus-within": {
                                        borderColor: "#3b82f6",
                                        boxShadow:
                                            "0 0 0 2px rgba(59, 130, 246, 0.25)",
                                    },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected
                                        ? "#3b82f6"
                                        : "white",
                                    ":active": { backgroundColor: "#bfdbfe" },
                                }),
                            }}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Sitio Web */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <TbWorldWww className="w-4 h-4 text-gray-500" />
                            Sitio web
                        </label>
                        <input
                            type="url"
                            name="urlWeb"
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                            value={formData.urlWeb}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com"
                        />
                    </div>

                    {/* Condiciones */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Condiciones especiales
                        </label>
                        <textarea
                            name="conditions"
                            rows={3}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 ring-blue-500/50 focus:border-blue-500"
                            value={formData.conditions}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors order-2 md:order-1"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm order-1 md:order-2"
                        >
                            Crear Proveedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSupplierModal;
