import { FC, DragEvent } from "react";
import TaskCard from "./TaskCard";
import React from "react";
import { Task } from "../../utils/types/types";

interface Column {
    title: string;
    status: number;
    color: string;
}

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    onDragOver: (e: DragEvent, status: number) => void;
    onDrop: (status: number) => void;
    draggedOverColumn: number | null;
    onDragStart: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onViewDetails: (task: Task) => void;
}

/**
 * Componente que representa una columna en el tablero Kanban
 * @param column - Datos de la columna (título, estado y estilo)
 * @param tasks - Lista de tareas asignadas a esta columna
 * @param onDragOver - Manejador de evento de arrastre sobre la columna
 * @param onDrop - Manejador de evento de soltar en la columna
 * @param draggedOverColumn - Estado de la columna sobre la que se está arrastrando
 * @param onDragStart - Manejador de inicio de arrastre de tarea
 * @param onDelete - Manejador de eliminación de tarea
 * @param onEdit - Manejador de edición de tarea
 * @param onViewDetails - Manejador de visualización de detalles de tarea
 */
const KanbanColumn: FC<KanbanColumnProps> = ({
    column,
    tasks,
    onDragOver,
    onDrop,
    draggedOverColumn,
    onDragStart,
    onDelete,
    onEdit,
    onViewDetails,
}) => {
    return (
        <div
            className={`flex-1 min-w-[300px] mx-5 rounded-lg p-4 border-t-4 bg-white shadow-lg 
           ${column.color} ${
                draggedOverColumn === column.status ? "opacity-75" : ""
            }`}
            onDragOver={(e: DragEvent) => onDragOver(e, column.status)}
            onDrop={() => onDrop(column.status)}
            role="region"
            aria-label={`Columna ${column.title}`}
        >
            {/* Encabezado de la columna con contador de tareas */}
            <h2 className="text-lg font-semibold mb-4">
                {column.title} (
                {tasks.filter((t) => t.status === column.status).length})
            </h2>

            {/* Listado de tareas */}
            <div className="space-y-3" role="list">
                {tasks
                    .filter((task) => task.status === column.status)
                    .map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={onDragStart}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onViewDetails={onViewDetails}
                        />
                    ))}
            </div>
        </div>
    );
};

export default KanbanColumn;
