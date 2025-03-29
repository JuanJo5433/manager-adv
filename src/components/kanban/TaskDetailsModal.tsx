import React, { useEffect, useMemo } from "react";
import { useState, type FC, type ChangeEvent } from "react";
import { CiCalendar } from "react-icons/ci";
import { Process, Task } from "../../utils/types/types";
import { editTask } from "@/services/processes/tasks";
import Select, { SingleValue } from "react-select";
import TaskComments from "../comments/TaskComments";

interface TaskDetailsModalProps {
    task: Task;
    setTask: (task: Task) => void;
    onClose: () => void;
    onSave: (task: Task) => void;
    process: Process;
}
type SelectOption<T = string> = { value: T; label: string };

const TaskDetailsModal: FC<TaskDetailsModalProps> = ({
    task,
    setTask,
    onClose,
    onSave,
    process,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : null,
    });
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const handleUsersSelection = (
        selectedOption: SingleValue<SelectOption>
    ) => {
        setSelectedUserId(selectedOption?.value || "");
    };

    useEffect(() => {
        setSelectedUserId(editedTask.user.id || "");
    }, [editedTask.user.id]);

    const userOptions = useMemo(
        () =>
            process.users?.map((user: any) => ({
                value: user.id,
                label: user.name || "Sin nombre",
            })) || [],
        [process.users]
    );

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({
            ...prev,
            [name]:
                name === "status"
                    ? (parseInt(value, 10) as Task["status"])
                    : value,
        }));
    };

    const handleSubmit = async () => {
        const result = await editTask(editedTask);
        onSave({ ...result, userId: selectedUserId });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl w-11/12 max-w-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={editedTask.title}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    ) : (
                        task.title
                    )}
                </h2>

                <div className="space-y-6">
                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Descripción
                        </label>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={editedTask.description ?? ""}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                            />
                        ) : (
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {task.description || "Sin descripción"}
                            </p>
                        )}
                    </div>

                    {/* Estado y Prioridad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Estado
                            </label>
                            {isEditing ? (
                                <select
                                    name="status"
                                    value={editedTask.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={0}>Pendiente</option>
                                    <option value={1}>En Progreso</option>
                                    <option value={2}>Completado</option>
                                    <option value={3}>Cancelado</option>
                                </select>
                            ) : (
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                                    ${
                                        [
                                            "bg-blue-100 text-blue-800", // Pendiente
                                            "bg-yellow-100 text-yellow-800", // En Progreso
                                            "bg-green-100 text-green-800", // Completado
                                            "bg-red-100 text-red-800", // Cancelado
                                        ][task.status]
                                    }`}
                                >
                                    {
                                        [
                                            "Pendiente",
                                            "En Progreso",
                                            "Completado",
                                            "Cancelado",
                                        ][task.status]
                                    }
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Prioridad
                            </label>
                            {isEditing ? (
                                <select
                                    name="priority"
                                    value={editedTask.priority}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="high">Alta</option>
                                    <option value="medium">Media</option>
                                    <option value="low">Baja</option>
                                </select>
                            ) : (
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                    ${
                                        task.priority === "low"
                                            ? "bg-green-100 text-green-800"
                                            : task.priority === "medium"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {task.priority === "low"
                                        ? "Baja"
                                        : task.priority === "medium"
                                        ? "Media"
                                        : "Alta"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Fecha Límite y Asignado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Fecha límite
                            </label>
                            <div className="flex items-center gap-2 text-gray-600">
                                <CiCalendar className="text-lg" />
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={
                                            editedTask.deadline instanceof Date
                                                ? editedTask.deadline
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const newDate = e.target.value
                                                ? new Date(
                                                      e.target.value +
                                                          "T00:00:00"
                                                  )
                                                : null;
                                            setEditedTask((prev) => ({
                                                ...prev,
                                                deadline: newDate,
                                            }));
                                        }}
                                        className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : task.deadline ? (
                                    new Date(task.deadline).toLocaleDateString()
                                ) : (
                                    "Sin fecha límite"
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Asignado a
                            </label>
                            {isEditing ? (
                                <Select
                                    options={userOptions}
                                    onChange={handleUsersSelection}
                                    classNamePrefix="react-select"
                                    placeholder="Seleccionar usuario"
                                    isSearchable
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: "44px",
                                            borderRadius: "0.5rem",
                                            borderColor: "#d1d5db",
                                            "&:hover": {
                                                borderColor: "#9ca3af",
                                            },
                                        }),
                                    }}
                                />
                            ) : (
                                <span className="text-gray-600 text-sm">
                                    {task.user.name || "Sin asignar"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comentarios */}
                    {!isEditing && (
                        <TaskComments task={task} setTask={setTask} />
                    )}
                </div>
                {/* Acciones */}
                <div className="flex justify-end gap-3 mt-8 border-t pt-6">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {isEditing ? "Descartar" : "Editar"}
                    </button>

                    {isEditing && (
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Guardar cambios
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
