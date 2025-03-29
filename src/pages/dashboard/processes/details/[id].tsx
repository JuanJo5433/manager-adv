import React, { useCallback, useEffect, useState, type FC } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/sidebar/Sidebar";
import Select from "react-select";

import { Process } from "@/utils/types/types";
import {
  deleteProcessById,
  getProcessById,
} from "@/services/processes/process/processService";
import { getUserById } from "@/services/users/user/userService";
import { getProductById, getProducts } from "@/services/product/productServices";
import { createProcessProducts, deleteProcessProduct } from "@/services/processProducts/processProducts";
import { createProcessUsers, deleteProcessUser } from "@/services/processUsers/processUsers";

import { FaRegFilePdf } from "react-icons/fa";
import { LuUserPlus } from "react-icons/lu";
import { FiTrash, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { getUsers } from "@/services/users/userService";

type SelectOption = { value: string; label: string };

const ProcessDetails: FC = () => {
  const router = useRouter();
  const id = router.query.id as string;

  // Estados generales
  const [process, setProcess] = useState<Process | null>(null);
  // Para renderizar los productos asociados al proceso
  const [products, setProducts] = useState<any[] | null>(null);
  // Productos disponibles para agregar (para el select)
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [newProductModal, setNewProductModal] = useState<boolean>(false);
  const [newUserModal, setNewUserModal] = useState<boolean>(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Función para obtener y transformar datos del proceso
  const fetchAndTransformProcessData = useCallback(async (processId: string) => {
    try {
      const result = await getProcessById(processId);
      if (!result || !result.tasks) throw new Error("Datos del proceso inválidos");

      // Enriquecer usuarios asociados
      const enrichedUsers = await Promise.all(
        result.users?.map(async (processUser) => {
          try {
            const user = await getUserById(processUser.userId);
            return user.length > 0
              ? {
                  id: user[0].id,
                  email: user[0].email,
                  username: user[0].username,
                  name: user[0].name,
                }
              : processUser;
          } catch (error) {
            console.error("Error obteniendo usuario:", error);
            return processUser;
          }
        }) || []
      );

      return { ...result, users: enrichedUsers } as Process;
    } catch (error) {
      console.error("Error procesando datos del proceso:", error);
      return null;
    }
  }, []);

  // Efecto para cargar datos del proceso
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const processData = await fetchAndTransformProcessData(id);
        if (processData) {
          setProcess(processData);
          // Si existen productos asociados, se obtienen sus detalles
          if (processData.products && processData.products.length > 0) {
            const productsData = await Promise.all(
              processData.products.map(async (p) => await getProductById(p.productId as string))
            );
            setProducts(productsData);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, fetchAndTransformProcessData]);

  // Función para eliminar el proceso completo
  const handleDeleteProcess = async () => {
    try {
      if (!id) return;
      const response = await deleteProcessById(id);
      console.log("Respuesta al eliminar el proceso:", response);
      router.push("/dashboard/processes");
    } catch (error) {
      console.error("Error al eliminar el proceso:", error);
    }
  };

  // Función para obtener la lista de productos disponibles (para el select)
  const fetchAvailableProducts = useCallback(async () => {
    try {
      const productsData = await getProducts();
      setAvailableProducts(productsData);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, []);

  // Función para obtener la lista de usuarios
  const fetchDataUsers = useCallback(async () => {
    try {
      const usersData = await getUsers();
      setUsersList(usersData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }, []);

  // Opciones para el select de productos
  const productOptions: SelectOption[] =
    availableProducts?.flat()
      .filter((product: any) =>
        !process?.products?.some((p: any) => p.productId === product.id)
      )
      .map((product: any) => ({
        value: product.id,
        label: `${product.name} - ${product.productType?.name}`,
      })) || [];

  // Opciones para el select de usuarios
  const userOptions: SelectOption[] =
    usersList?.flat()
      .filter((user: any) =>
        !process?.users?.some((p: any) => p.id === user.id)
      )
      .map((user: any) => ({
        value: user.id,
        label: `${user.name} - ${user.email}`,
      })) || [];

  // Manejo de la selección de productos (componente controlado)
  const handleProductSelection = (options: readonly SelectOption[]) => {
    setSelectedProductIds(options.map((opt) => opt.value));
  };

  // Manejo de la selección de usuarios (componente controlado)
  const handleUserSelection = (options: readonly SelectOption[]) => {
    setSelectedUserIds(options.map((opt) => opt.value));
  };

  // Al abrir el modal de productos, limpiar la selección y cargar los productos disponibles
  useEffect(() => {
    if (newProductModal) {
      setSelectedProductIds([]);
      fetchAvailableProducts();
    }
  }, [newProductModal, fetchAvailableProducts]);

  // Al abrir el modal de usuarios, limpiar la selección y cargar la lista de usuarios
  useEffect(() => {
    if (newUserModal) {
      setSelectedUserIds([]);
      fetchDataUsers();
    }
  }, [newUserModal, fetchDataUsers]);

  // Función para agregar productos al proceso
  const handleSubmitProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && selectedProductIds.length > 0) {
        await Promise.all(
          selectedProductIds.map((productId) =>
            createProcessProducts({ processId: id, productsId: [productId] })
          )
        );
        const updatedProcess = await fetchAndTransformProcessData(id);
        setProcess(updatedProcess);
        if (updatedProcess?.products && updatedProcess.products.length > 0) {
          const productsData = await Promise.all(
            updatedProcess.products.map(async (p) => await getProductById(p.productId as string))
          );
          setProducts(productsData);
        } else {
          setProducts([]);
        }
        setNewProductModal(false);
      }
    } catch (error) {
      console.error("Error agregando productos:", error);
    }
  };

  // Función para agregar usuarios al proceso
  const handleSubmitUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && selectedUserIds.length > 0) {
        await Promise.all(
          selectedUserIds.map((userId) =>
            createProcessUsers({ processId: id, usersId: [userId] })
          )
        );
        const updatedProcess = await fetchAndTransformProcessData(id);
        setProcess(updatedProcess);
        setNewUserModal(false);
      }
    } catch (error) {
      console.error("Error agregando usuarios:", error);
    }
  };

  // Función para eliminar un producto del proceso y actualizar la lista
  const handleRemoveProduct = async (productId: string) => {
    try {
      await deleteProcessProduct({ processId: id, productId });
      const updatedProcess = await fetchAndTransformProcessData(id);
      setProcess(updatedProcess);
      if (updatedProcess?.products && updatedProcess.products.length > 0) {
        const productsData = await Promise.all(
          updatedProcess.products.map(async (p) => await getProductById(p.productId as string))
        );
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error removiendo producto:", error);
    }
  };

  // Función para eliminar un usuario del proceso
  const handleRemoveUser = async (userId: string) => {
    try {
      await deleteProcessUser({ processId: id, userId });
      const updatedProcess = await fetchAndTransformProcessData(id);
      setProcess(updatedProcess);
    } catch (error) {
      console.error("Error removiendo usuario:", error);
    }
  };

  // Alternar visibilidad de tareas
  const toggleTasks = () => {
    setIsTasksExpanded(!isTasksExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg w-full">
        {/* Título y botón de voucher */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{process?.title}</h1>
        <button className="flex my-5 items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
          <FaRegFilePdf />
          Generar voucher
        </button>

        {/* Información General */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <p className="text-gray-600"><strong>ID:</strong> {process?.id}</p>
          <p className="text-gray-600">
            <strong>Estado:</strong>{" "}
            <span className="ml-1 font-semibold text-blue-700">
              {process && ["Pendiente", "En Progreso", "Completado", "Cancelado"][process.status]}
            </span>
          </p>
          <p className="text-gray-600">
            <strong>Fecha de creación:</strong>{" "}
            {process?.createdAt && new Date(process.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Información del Cliente */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información del cliente</h2>
          {process?.client && (
            <div className="text-gray-600 space-y-2">
              <p><strong>Nombre:</strong> {process.client.name}</p>
              <p><strong>Documento:</strong> {process.client.document}</p>
              <p><strong>Email:</strong> {process.client.email}</p>
              <p><strong>Teléfono:</strong> {process.client.phone}</p>
              <p><strong>Observación:</strong> {process.client.observation}</p>
            </div>
          )}
        </div>

        {/* Sección de Productos */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Productos</h2>
          <div className="space-y-4">
            {products?.flat().map((product: any) => (
              <div
                key={product.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
              >
                <p className="text-sm text-gray-700">
                  {product.name} - {product.productType?.name}
                </p>
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="p-1 rounded-full text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setNewProductModal(true)}
              className="p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer w-full hover:bg-gray-200"
            >
              <p className="text-sm text-gray-600 flex flex-row items-center gap-4">
                <AiOutlineProduct />
                Agregar producto
              </p>
            </button>
          </div>
        </div>

        {/* Sección de Tareas */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={toggleTasks}>
            <h2 className="text-xl font-bold text-gray-800">Tareas</h2>
            <span className="text-gray-500 text-xl">
              {isTasksExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </div>
          {isTasksExpanded && (
            <div className="space-y-4 mt-4">
              {process?.tasks.length === 0 && (
                <p className="text-gray-600">No hay tareas asociadas a este proceso.</p>
              )}
              {process?.tasks.map((task) => (
                <div key={task.id} className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>
                      <strong>Estado:</strong>{" "}
                      {["Pendiente", "En Progreso", "Completado", "Cancelado"][task.status]}
                    </p>
                    <p>
                      <strong>Prioridad:</strong> {task.priority}
                    </p>
                    <p>
                      <strong>Fecha límite:</strong>{" "}
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "Sin fecha"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Usuarios Asociados */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Usuarios asociados</h2>
          <div className="space-y-4">
            {process?.users?.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
              >
                <p className="text-sm text-gray-700">{user.name}</p>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="p-1 rounded-full text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setNewUserModal(true)}
              className="p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer w-full hover:bg-gray-200"
            >
              <p className="text-sm text-gray-600 flex flex-row items-center gap-4">
                <LuUserPlus />
                Agregar usuario
              </p>
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setModalDelete(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            <FiTrash /> Eliminar
          </button>
        </div>
      </div>

      {/* Modal de confirmación para eliminar el proceso */}
      {modalDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleDeleteProcess();
              setModalDelete(false);
            }
          }}
          tabIndex={0}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-700">
              ¿Estás seguro de eliminar este Proceso?
            </h2>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModalDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteProcess();
                  setModalDelete(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Estoy seguro, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar un nuevo producto */}
      {newProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <Select
              options={productOptions}
              isMulti
              onChange={handleProductSelection}
              value={productOptions.filter(opt => selectedProductIds.includes(opt.value))}
              classNamePrefix="react-select"
              placeholder="Seleccionar productos..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setNewProductModal(false);
                  setSelectedProductIds([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitProducts}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar un nuevo usuario */}
      {newUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <Select
              options={userOptions}
              isMulti
              onChange={handleUserSelection}
              value={userOptions.filter(opt => selectedUserIds.includes(opt.value))}
              classNamePrefix="react-select"
              placeholder="Seleccionar usuarios..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setNewUserModal(false);
                  setSelectedUserIds([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitUsers}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessDetails;
