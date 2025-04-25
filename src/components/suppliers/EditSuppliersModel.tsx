import React, {
  useState,
  useEffect,
  useMemo,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { TbX, TbWorldWww, TbPhone, TbMail, TbUser, TbNote, TbCategory } from "react-icons/tb";
import Select, { MultiValue } from "react-select";
import { editSupplier } from "@/services/suppliers/suppliersServices";
import { getSuppliersTypes } from "@/services/suppliers/supplierTypes/supplierTypesServices";
import { SupplierType } from "@/utils/types/types";

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
  supplier: {
    id: string;
    name: string;
    nameRepresentative: string;
    description: string;
    nit: string;
    email: string;
    phone: string;
    urlWeb: string;
    conditions: string;
    supplierTypes: { id: string; name: string }[];
  };
}

type SelectOption = { value: string; label: string };

const EditSupplierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  refreshSuppliers,
  supplier,
}) => {
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
  const [selectedTypes, setSelectedTypes] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: supplier.name,
      nameRepresentative: supplier.nameRepresentative,
      description: supplier.description,
      nit: supplier.nit,
      email: supplier.email,
      phone: supplier.phone,
      urlWeb: supplier.urlWeb,
      conditions: supplier.conditions,
    });

    (async () => {
      try {
        const resp = await getSuppliersTypes();
        setSupplierTypes(resp.dataType);
        const initial = supplier.supplierTypes.map((t) => ({
          value: t.id,
          label: t.name,
        }));
        setSelectedTypes(initial);
      } catch (err) {
        console.error("Error fetching supplier types:", err);
      }
    })();
  }, [isOpen, supplier]);

  const typeOptions = useMemo(
    () => supplierTypes.map((t) => ({ value: t.id, label: t.name })),
    [supplierTypes]
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newValue: MultiValue<SelectOption>) => {
    setSelectedTypes(newValue as SelectOption[]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const typeSuppliers = selectedTypes.map((o) => ({
      supplierTypeId: o.value,
      supplierId: supplier.id,
    }));
    await editSupplier(supplier.id, formData, typeSuppliers);
    refreshSuppliers();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-8">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Editar Proveedor</h2>
          <button onClick={onClose} aria-label="Cerrar modal">
            <TbX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700">
                <TbUser /> Nombre *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700">
                <TbUser /> Representante
              </label>
              <input
                name="nameRepresentative"
                value={formData.nameRepresentative}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700">
              <TbNote /> Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700">
              <TbNote /> NIT *
            </label>
            <input
              name="nit"
              value={formData.nit}
              onChange={handleInputChange}
              required
              placeholder="900123456-7"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700">
                <TbMail /> Correo
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700">
                <TbPhone /> Teléfono
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700">
              <TbCategory /> Tipo *
            </label>
            <Select
              isMulti
              options={typeOptions}
              value={selectedTypes}
              onChange={handleTypeChange}
              placeholder="Seleccionar..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 44,
                  borderRadius: "0.5rem",
                }),
              }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700">
              <TbWorldWww /> Sitio web
            </label>
            <input
              name="urlWeb"
              type="url"
              value={formData.urlWeb}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="text-gray-700">Condiciones</label>
            <textarea
              name="conditions"
              value={formData.conditions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
