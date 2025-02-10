// components/products/ProductModal.jsx
import { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSave, product, productTypes }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        price: "",
        discount: "",
        description: "",
        availability: true,
        imageUrl: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                type: product.productType?.id || "", // Usar el id del tipo de producto
                price: product.price || "",
                discount: product.discount || "",

                description: product.description || "",
                availability: product.availability ?? true,
                imageUrl: product.imageUrl || "",
            });
        } else {
            setFormData({
                name: "",
                type: "",
                price: "",
                discount: "",
                description: "",
                availability: true,
                imageUrl: "",
            });
        }
    }, [product]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
   
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            price: parseFloat(formData.price),
            discount: parseFloat(formData.discount)
        };
        onSave(updatedFormData);
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
                            name="type"
                            value={formData.type}
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
                        <label className="block mb-1">Descuento en porcentaje (Opcional)</label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            step="0.01"
                            max={100}
                            min={1}
                            
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border px-3 py-2 rounded"
                        ></textarea>
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
