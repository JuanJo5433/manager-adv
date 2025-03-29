import { useState, useEffect } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/services/product/productServices";
import ProductModal from "@/components/products/ProductModal";
import Sidebar from "@/components/sidebar/Sidebar";
import Pagination from "@/components/common/Pagination";
import { fetchProductTypes } from "@/services/product/typeProducts/typeProductsServices";
import DeleteConfirmationModal from "@/components/products/DeleteConfirmationModal";
import React from "react";
import { Products, ProductType } from "@/utils/types/types";

const ProductsPage: React.FC = () => {
    // Estados del componente
    const [products, setProducts] = useState<Products[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]); // Ahora se inicia como array vacío
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Constantes para la paginación
    const itemsPerPage = 5;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Cargar productos y tipos de productos al montar el componente
    useEffect(() => {
        const fetchProductsAndTypes = async () => {
            try {
                const productsData = await getProducts();
                const productTypesData = await fetchProductTypes();
                console.log("🚀 ~ fetchProductsAndTypes ~ productTypesData:", productTypesData)
                setProducts(productsData);
                setProductTypes(productTypesData);
            } catch (error) {
                console.error("Error fetching products and types:", error);
            }
        };

        fetchProductsAndTypes();
    }, []);

    // Filtrar productos basados en la búsqueda y paginar
    const filteredProducts = products
        .filter((product) =>
            Object.values(product).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .slice(startIndex, endIndex);

    // Función para guardar un producto (crear o actualizar)
    const handleSaveProduct = async (productData: any) => {
        try {
            if (selectedProduct) {
                const updatedProduct = await updateProduct(
                    selectedProduct.id,
                    productData
                );
                // Buscar el tipo de producto actualizado
                const updatedProductType = productTypes.find(
                    (type) => type.id === updatedProduct.productTypeId
                );
                if (!updatedProductType) {
                    throw new Error("Tipo de producto no encontrado");
                }
                setProducts(
                    products.map((p) =>
                        p.id === updatedProduct.id
                            ? {
                                  ...updatedProduct,
                                  productType: updatedProductType,
                              }
                            : p
                    )
                );
            } else {
                const newProduct = await createProduct(productData);
                // Buscar el tipo de producto para el nuevo producto
                const newProductType = productTypes.find(
                    (type) => type.id === newProduct.productTypeId
                );
                if (!newProductType) {
                    throw new Error("Tipo de producto no encontrado");
                }
                setProducts([
                    ...products,
                    { ...newProduct, productType: newProductType },
                ]);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    // Función para eliminar un producto
    const handleDeleteProduct = async () => {
        try {
            if (selectedProduct) {
                await deleteProduct(selectedProduct.id);
                setProducts(products.filter((p) => p.id !== selectedProduct.id));
                setDeleteModalOpen(false);
                setSelectedProduct(null);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="md:ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
                            Gestión de Productos
                        </h1>
                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                setIsModalOpen(true);
                            }}
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
                            Nuevo Producto
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
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
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descuento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Imagen
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Disponibilidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                                                {product.productType.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.description || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                ${product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.discount
                                                    ? `${product.discount}%`
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.availability
                                                    ? "Disponible"
                                                    : "No Disponible"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </main>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                product={selectedProduct}
                productTypes={productTypes} // Se pasa el array de tipos (requerido)
            />
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteProduct}
            />
        </div>
    );
};

export default ProductsPage;
