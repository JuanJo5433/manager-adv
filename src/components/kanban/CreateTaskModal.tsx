import { createTask } from "@/services/processes/tasks";
import { Process, Task } from "@/utils/types/types";
import { useRouter } from "next/router";
import React, { useState, FC, ChangeEvent, useMemo } from "react";
import { CiCalendar } from "react-icons/ci";
import Select, { SingleValue } from "react-select";

interface CreateTaskModalProps {
    onClose: () => void;
    onSave: (task: Task) => void;
    process: Process;
}

type SelectOption<T = string> = { value: T; label: string };

const CreateTaskModal: FC<CreateTaskModalProps> = ({
    onClose,
    onSave,
    process,
}) => {
    const router = useRouter();
    const processId = router.query.Id as string;

    // Estado para la nueva tarea y usuario seleccionado
    const [newTask, setNewTask] = useState<
        Omit<Task, "id" | "process" | "user" | "comments" | "createdAt">
    >({
        title: "",
        description: "",
        status: 0,
        priority: "medium",
        deadline: null,
        userId: "",
        processId: "",
    });
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    // Opciones para el selector de usuarios
    const userOptions = useMemo(
        () =>
            process.users?.map((user: any) => ({
                value: user.id,
                label: user.name || "Sin nombre",
            })) || [],
        [process.users]
    );

    // Maneja cambios en los inputs del formulario
    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]:
                name === "status"
                    ? parseInt(value, 10)
                    : name === "deadline"
                    ? value
                        ? new Date(value)
                        : null
                    : value,
        }));
    };

    // Maneja selección de usuario asignado
    const handleUsersSelection = (
        selectedOption: SingleValue<SelectOption>
    ) => {
        setSelectedUserId(selectedOption?.value || "");
    };

    // Valida y crea la nueva tarea
    const handleCreate = async () => {
        if (!newTask.title.trim()) {
            alert("El título de la tarea es requerido");
            return;
        }

        if (!selectedUserId) {
            alert("Debes seleccionar un usuario asignado");
            return;
        }

        try {
            const taskPayload = {
                ...newTask,
                userId: selectedUserId,
                processId,
            };

            const createdTask = await createTask(taskPayload);

            const fullTask: Task = {
                ...createdTask,
                user:
                    process.users?.find((u) => u.id === selectedUserId) || null,
                process: process,
                comments: [],
                createdAt: new Date(),
            };

            onSave(fullTask);
            onClose();
        } catch (error) {
            alert("Error al crear la tarea. Por favor intente nuevamente.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">
                    <input
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Título de la tarea"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                </h2>

                <div className="space-y-4">
                    <div className="flex flex-col">
                        <strong>Descripción</strong>
                        <textarea
                            name="description"
                            value={newTask.description ?? ""}
                            onChange={handleInputChange}
                            placeholder="Añadir descripción..."
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            rows={4}
                        />
                    </div>

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

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <strong>Fecha límite (opcional)</strong>
                            <CiCalendar className="text-lg" />
                        </div>
                        <input
                            type="date"
                            name="deadline"
                            value={
                                newTask.deadline?.toISOString().split("T")[0] ||
                                ""
                            }
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-lg"
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <div>
                        <strong>Asignado a</strong>
                        <Select
                            required={true}
                            options={userOptions}
                            onChange={handleUsersSelection}
                            classNamePrefix="react-select"
                            placeholder="Seleccionar usuario..."
                            isSearchable
                        />
                    </div>
                </div>

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
