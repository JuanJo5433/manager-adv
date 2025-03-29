import Pagination from "@/components/common/Pagination";
import CreateProcessModal from "@/components/process/CreateProcessModal";
import Sidebar from "@/components/sidebar/Sidebar";
import {
    createProcess,
    getProcesses,
} from "@/services/processes/processesServices";
import { Process } from "@/utils/types/types";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegFolder } from "react-icons/fa6";

const ProcesosPage: React.FC = () => {
    // Estado para almacenar los procesos obtenidos desde el backend
    const [processes, setProcesses] = useState<Process[]>([]);
    console.log("🚀 ~ processes:", processes);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const itemsPerPage = 5;

    const totalPages = useMemo(
        () => Math.ceil(processes.length / itemsPerPage),
        [processes.length]
    );

    // Función que transforma un objeto recibido en uno que cumple la interfaz Process
    const transformProcess = (p: any): Process => {
        return {
            createdAt: p.createdAt,
            id: p.id,
            title: p.title,
            slug: p.slug || "",
            clientId: p.clientId,
            client: p.client,
            products: p.products || [],
            status: p.status,
            tasks: p.tasks || [],
        };
    };

    // Obtención de procesos al montar el componente
    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const resultProcesses: any[] = await getProcesses();
                // Transformamos cada proceso para garantizar que tenga todas las propiedades requeridas.
                const completeProcesses: Process[] =
                    resultProcesses.map(transformProcess);
                setProcesses(completeProcesses);
            } catch (error) {
                console.error("Error al obtener los procesos:", error);
            }
        };

        fetchProcesses();
    }, []);

    // Función para crear un nuevo proceso
    const handleCreateProcess = async (data: any) => {
        try {
            const result: any = await createProcess(data);
            console.log("🚀 ~ handleCreateProcess ~ result:", result);
            const newProcess = transformProcess(result);
            setProcesses((prev) => [...prev, newProcess]);
            setIsModalCreateOpen(false);
            return result.id;
        } catch (error) {
            console.error("Error al crear el proceso:", error);
        }
    };
    const filteredProcess = useMemo(() => {
        const filtered = processes.filter((process) =>
            Object.values(process).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    }, [processes, searchQuery, currentPage]);
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="md:ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Gestión de procesos
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <select className="px-4 py-2 border rounded-lg text-sm">
                                <option>Todos los estados</option>
                                <option>Pendiente</option>
                                <option>Activo</option>
                                <option>Completado</option>
                            </select>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm"
                                onClick={() => setIsModalCreateOpen(true)}
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
                                Nuevo Proceso
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar proceso..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-gray-600 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            Reserva
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
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
                                    {filteredProcess.map((proceso) => (
                                        <tr
                                            key={proceso.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {proceso.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                <Link
                                                    href={`/clientes/${proceso.clientId}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {proceso.client?.name ||
                                                        "Sin documento"}
                                                </Link>
                                            </td>
                                           
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        proceso.status === 1
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : proceso.status ===
                                                              2
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {proceso.status === 1
                                                        ? "En progreso"
                                                        : "Completado"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    {proceso.tasks.length ===
                                                    0 ? (
                                                        <span className="text-sm text-gray-400">
                                                            Sin tareas
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${
                                                                            (proceso.tasks.filter(
                                                                                (
                                                                                    task: any
                                                                                ) =>
                                                                                    task.status ===
                                                                                    2
                                                                            )
                                                                                .length /
                                                                                proceso
                                                                                    .tasks
                                                                                    .length) *
                                                                            100
                                                                        }%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-600">
                                                                {
                                                                    proceso.tasks.filter(
                                                                        (
                                                                            task
                                                                        ) =>
                                                                            task.status ===
                                                                            2
                                                                    ).length
                                                                }
                                                                /
                                                                {
                                                                    proceso
                                                                        .tasks
                                                                        .length
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(
                                                    proceso.createdAt
                                                ).toLocaleDateString("es-ES")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                <div className="text-blue-800">
                                                    <Link
                                                        href={`processes/board/${proceso.id}`}
                                                    >
                                                        <FaRegFolder />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    {processes.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron procesos
                        </div>
                    )}
                </div>
                <CreateProcessModal
                    isOpen={isModalCreateOpen}
                    onClose={() => setIsModalCreateOpen(false)}
                    onCreate={handleCreateProcess}
                />
            </main>
        </div>
    );
};

export default ProcesosPage;
