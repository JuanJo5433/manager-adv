import { createTask } from "@/services/processes/tasks";
import React from "react";
import { useState, type FC, type ChangeEvent } from "react";
import { CiCalendar } from "react-icons/ci";

// Interfaces de tipos
interface TaskFormData {
    title: string;
    description: string;
    status: number;
    priority: "high" | "medium" | "low";
    deadline: string | null;
    process: {
        connect: {
            id: string;
        };
    };
    user: {
        connect: {
            id: string;
        };
    };
    comments: Record<string, unknown>;
}

interface CreateTaskModalProps {
    onClose: () => void;
    processId: string;
    setTasks: React.Dispatch<React.SetStateAction<any[]>>; // Reemplaza any con tu interfaz Task si está disponible
}

/**
 * Componente modal para creación de nuevas tareas
 * @param onClose - Función para cerrar el modal
 * @param processId - ID del proceso al que pertenece la tarea
 * @param setTasks - Función para actualizar la lista de tareas
 */
const CreateTaskModal: FC<CreateTaskModalProps> = ({
    onClose,
    processId,
    setTasks,
}) => {
    // Estado del formulario con tipo explícito
    const [newTask, setNewTask] = useState<TaskFormData>({
        title: "A",
        description: "eeeeeeeee",
        status: 0,
        priority: "medium",
        deadline: null,
        process: {
            connect: { id: processId },
        },
        user: {
            connect: { id: "3471e6d7-7193-4478-943e-85fc0137f619" },
        },
        comments: {},
    });

    // Manejador de cambios en los inputs con tipado seguro
    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === "userId") {
            setNewTask((prev) => ({
                ...prev,
                user: { connect: { id: value } },
            }));
        } else if (name === "status") {
            setNewTask((prev) => ({
                ...prev,
                status: parseInt(value, 10),
            }));
        } else if (name === "deadline") {
            setNewTask((prev) => ({
                ...prev,
                deadline: value || null,
            }));
        } else {
            setNewTask((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Manejador de creación de tarea
    const handleCreate = async () => {
        try {
            const result = await createTask(newTask);
            setTasks((prev) => [...prev, result]);
            onClose();
        } catch (error) {
            console.error("Error creating task:", error);
            // Aquí podrías agregar manejo de errores visual
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                {/* Cabecera del modal */}
                <h2 className="text-xl font-semibold mb-4">
                    <input
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Título de la tarea"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </h2>

                {/* Cuerpo del formulario */}
                <div className="space-y-4">
                    {/* Descripción */}
                    <div className="flex flex-col">
                        <strong>Descripción</strong>
                        <textarea
                            name="description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            placeholder="Añadir descripción..."
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            rows={4}
                        />
                    </div>

                    {/* Estado y Prioridad */}
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <strong>Estado</strong>
                            <select
                                name="status"
                                value={newTask.status}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value={0}>Pendiente</option>
                                <option value={1}>En Progreso</option>
                                <option value={2}>Completado</option>
                                <option value={3}>Cancelado</option>
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <strong>Prioridad</strong>
                            <select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="high">Alta</option>
                                <option value="medium">Media</option>
                                <option value="low">Baja</option>
                            </select>
                        </div>
                    </div>

                    {/* Fecha límite */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <strong>Fecha límite (opcional)</strong>
                            <CiCalendar className="text-lg" />
                        </div>
                        <input
                            type="date"
                            name="deadline"
                            value={newTask.deadline || ""}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Asignación de usuario */}
                    <div>
                        <strong>Asignado a</strong>
                        <input
                            type="text"
                            name="userId"
                            value={newTask.user.connect.id}
                            onChange={handleInputChange}
                            placeholder="ID del usuario asignado"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {/* Footer del modal */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Crear tarea
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
