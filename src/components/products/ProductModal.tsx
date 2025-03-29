import React, { FC, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Products, ProductType } from "@/utils/types/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    product: Omit<Products, "id" | "productType"> & {
      type: string;
      price: number;
      discount: number;
    }
  ) => void;
  product?: Products | null;
  productTypes: ProductType[];
}

interface FormData {
  name: string;
  productTypeId: string;
  price: string;
  discount: string;
  description: string;
  availability: boolean;
  imageUrl: string;
}

const ProductModal: FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  productTypes,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    productTypeId: "",
    price: "",
    discount: "",
    description: "",
    availability: true,
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        productTypeId: product.productType.id,
        price: product.price.toString(),
        discount: product.discount?.toString() || "",
        description: product.description || "",
        availability: product.availability,
        imageUrl: product.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        productTypeId: "",
        price: "",
        discount: "",
        description: "",
        availability: true,
        imageUrl: "",
      });
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0,
    };

    onSave({
      ...updatedFormData,
      type: formData.productTypeId,
      productId: product?.id || "", // Add productId to the object
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Tipo</label>
            <select
              name="productTypeId"
              value={formData.productTypeId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Selecciona un tipo de producto</option>
              {productTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">
              Descuento en porcentaje (Opcional)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Disponible</label>
          </div>

          <div className="mb-4">
            <label className="block mb-1">URL de la Imagen</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;