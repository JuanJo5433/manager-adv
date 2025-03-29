import { FC } from "react";
import { CiCalendar } from "react-icons/ci";
import { VscComment } from "react-icons/vsc";
import { FaUser } from "react-icons/fa";
import React from "react";
import { Task } from "@/utils/types/types";

interface TaskCardProps {
    task: Task;
    onDragStart: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onViewDetails: (task: Task) => void;
}

/**
 * Componente que representa una tarjeta de tarea en el tablero Kanban
 * @param task - Objeto con la información de la tarea
 * @param onDragStart - Manejador de inicio de arrastre
 * @param onViewDetails - Manejador de visualización de detalles
 */
const TaskCard: FC<TaskCardProps> = ({ task, onDragStart, onViewDetails }) => {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(task.id)}
            onClick={() => onViewDetails(task)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
            role="button"
            aria-label={`Tarjeta de tarea: ${task.title}`}
            tabIndex={0}
        >
            {/* Título de la tarea */}
            <h3 className="font-medium">{task.title}</h3>

            {/* Sección de etiquetas */}
            <div className="flex items-start mb-2 gap-2 mt-2">
                <div className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded-lg">
                    Paquete turistico
                </div>
                <div>
                    <span
                        className={`text-sm px-2 py-1 rounded-full ${
                            task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {task.priority === "low"
                                        ? "Baja"
                                        : task.priority === "medium"
                                        ? "Media"
                                        : "Alta"}
                    </span>
                </div>
            </div>

            {/* Información adicional */}
            <div className="flex gap-3 mt-3 text-sm">
                {/* Fecha límite */}
                <div className="flex text-gray-500 items-center gap-1">
                    <CiCalendar />
                    {task.deadline === null ? (
                        <p>Sin fecha limite</p>
                    ) : task.deadline ? (
                        new Date(task.deadline).toLocaleDateString()
                    ) : (
                        "Sin fecha limite"
                    )}
                </div>

                {/* Comentarios */}
                <div className="flex text-gray-500 items-center gap-1">
                    <VscComment />
                    <p>{task.comments?.length || 0}</p>
                </div>

                {/* Usuario asignado */}
                <div className="flex text-gray-500 items-center gap-1">
                    <FaUser />
                    <p>
                        {" "}
                        {task.user?.name || "Cargando..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
