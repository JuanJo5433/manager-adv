import Sidebar from "@/components/sidebar/Sidebar";
import { getProccesses } from "@/services/proccesses/proccessesServices";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegFolder } from "react-icons/fa6";

// Componente principal de la página de Procesos
export default function ProcesosPage() {
  // Estado para almacenar los procesos obtenidos desde el backend
  const [proccess, setproccess] = useState([]);

  // useEffect se ejecuta al montar el componente para obtener los procesos
  useEffect(() => {
    try {
      // Función asíncrona para obtener la información de los procesos
      const getProccessesData = async () => {
        const resultProccess = await getProccesses(); // Llama al servicio para obtener procesos
        console.log(resultProccess);
        setproccess(resultProccess); // Actualiza el estado con los procesos obtenidos
      };
      getProccessesData();
    } catch (error) {
      console.log("Error al obtener los procesos:", error);
    }
  }, []);

  // En caso de que el estado sea null, se imprime un log (aunque el estado inicial es un arreglo vacío)
  if (proccess === null) {
    console.log("NO hay datos");
  }

  return (
    // Contenedor principal con fondo gris claro y altura mínima de pantalla completa
    <div className="min-h-screen bg-gray-50">
      {/* Componente Sidebar para la navegación lateral */}
      <Sidebar />

      {/* Contenedor principal del contenido con margen izquierdo para pantallas medianas y transición */}
      <main className="md:ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header de la página con título y controles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Gestión de procesos
            </h1>

            {/* Controles para filtrar y crear procesos */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select className="px-4 py-2 border rounded-lg text-sm">
                <option>Todos los estados</option>
                <option>Activo</option>
                <option>Completado</option>
              </select>

              {/*
              Se ha comentado el selector de clientes para usarlo en el futuro, si es necesario.
              <select className="px-4 py-2 border rounded-lg text-sm">
                  <option>Todos los clientes</option>
                  {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                      </option>
                  ))}
              </select>
              */}

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                           flex items-center justify-center text-sm"
              >
                {/* Ícono SVG que indica la acción de agregar un nuevo proceso */}
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
                Nuevo Procesos
              </button>
            </div>
          </div>

          {/* Sección de Buscador */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar proceso..."
                className="w-full text-gray-600 pl-10 pr-4 py-2 border rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {/* Ícono de búsqueda posicionado dentro del input */}
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

          {/* Sección de la Tabla que lista los procesos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserva
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carpeta
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Se recorre el arreglo de procesos para renderizar una fila por cada uno */}
                  {proccess.map((proceso) => (
                    <tr
                      key={proceso.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Columna de Título o Reserva */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {proceso.title}
                      </td>
                      {/* Columna de Cliente: se muestra un link al detalle del cliente */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <Link
                          href={`/clientes/${proceso.clientId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {proceso.client?.name || "Sin documento"}
                        </Link>
                      </td>
                      {/* Columna de Productos: por ahora se muestra un placeholder */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <span className="text-gray-400 text-sm">
                          Sin productos
                        </span>
                      </td>
                      {/* Columna de Estado: muestra el estado con estilos condicionales */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            proceso.status === "progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : proceso.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {proceso.status === "progress"
                            ? "En progreso"
                            : "Completado"}
                        </span>
                      </td>
                      {/* Columna de Progreso: barra de progreso (placeholder) */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `0%`, // Aquí se puede calcular el progreso real basado en tareas
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            0/0
                          </span>
                        </div>
                      </td>
                      {/* Columna de Fecha: formatea la fecha de creación */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(proceso.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      {/* Columna de Carpeta: enlace a la vista del tablero del proceso */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <div className="text-blue-800">
                          <a href={`processes/board/${proceso.id}`}>
                            <FaRegFolder />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Si no se encontraron procesos, se muestra un mensaje al usuario */}
        {proccess.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron procesos
          </div>
        )}
      </main>
    </div>
  );
}
