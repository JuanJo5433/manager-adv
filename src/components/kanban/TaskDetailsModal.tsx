import React from "react";
import { useState, type FC, type ChangeEvent } from "react";
import { CiCalendar } from "react-icons/ci";
import { Task } from "../../utils/types/types";

// Interfaces de tipos



interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

/**
 * Componente modal para ver y editar detalles de tareas
 * @param task - Objeto con la información de la tarea
 * @param onClose - Función para cerrar el modal
 * @param onSave - Función para guardar los cambios
 */
const TaskDetailsModal: FC<TaskDetailsModalProps> = ({ task, onClose, onSave }) => {
  // Estados del componente
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  

  // Manejador de cambios en los inputs
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value, 10) as Task['status'] : value
    }));
  };

  // Manejador para guardar cambios
  const handleSave = () => {
    onSave({
      ...editedTask,
      deadline: editedTask.deadline ? new Date(editedTask.deadline) : null
    });
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="task-details-modal"
    >
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
        {/* Encabezado con título editable */}
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              aria-label="Editar título de la tarea"
            />
          ) : (
            task.title
          )}
        </h2>

        {/* Contenido principal del modal */}
        <div className="space-y-4">
          {/* Sección de descripción */}
          <div className="flex flex-col">
            <strong>Descripción</strong>
            {isEditing ? (
              <textarea
                name="description"
                value={editedTask.description ?? ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="Editar descripción"
              />
            ) : (
              <p className="text-gray-500 text-sm">{task.description}</p>
            )}
          </div>

          {/* Estado y Prioridad */}
          <div className="flex gap-4 flex-wrap">
            {/* Estado de la tarea */}
            <div className="flex-1 min-w-[150px]">
              <strong>Estado</strong>
              {isEditing ? (
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  aria-label="Seleccionar estado"
                >
                  <option value={0}>Pendiente</option>
                  <option value={1}>En Progreso</option>
                  <option value={2}>Completado</option>
                  <option value={3}>Cancelado</option>
                </select>
              ) : (
                <div className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded-lg">
                  {['Pendiente', 'En Progreso', 'Completado', 'Cancelado'][task.status]}
                </div>
              )}
            </div>

            {/* Prioridad de la tarea */}
            <div className="flex-1 min-w-[150px]">
              <strong>Prioridad</strong>
              {isEditing ? (
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  aria-label="Seleccionar prioridad"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              ) : (
                <div className={`text-sm px-2 py-1 rounded-lg ${
                  task.priority === 'low' ? 'bg-green-100' :
                  task.priority === 'medium' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  {task.priority}
                </div>
              )}
            </div>
          </div>

          {/* Fecha límite */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <strong>Fecha límite</strong>
              <CiCalendar className="text-lg" />
            </div>
            {isEditing ? (
              <input
                type="date"
                name="deadline"
                value={editedTask.deadline?.toISOString().split('T')[0] || ''}
                onChange={e => setEditedTask(prev => ({
                  ...prev,
                  deadline: e.target.value ? new Date(e.target.value) : null
                }))}
                className="p-2 border border-gray-300 rounded-lg"
                aria-label="Seleccionar fecha límite"
              />
            ) : task.deadline ? (
              <p className="text-gray-500 text-sm">
                {task.deadline.toLocaleDateString()}
              </p>
            ) : (
              <p className="text-gray-500 text-sm">No hay fecha límite</p>
            )}
          </div>

          {/* Usuario asignado */}
          <div>
            <strong>Asignado a</strong>
            <p className="text-gray-500">
              {task.user?.username || "Sin asignar"}
            </p>
          </div>

          {/* Lista de comentarios */}
          <div>
            <strong>Comentarios</strong>
            <div className="space-y-2 mt-2">
              {task.comments.map(comment => (
                <div 
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-2"
                >
                  <div className="flex gap-2 items-center text-sm">
                    <strong>{comment.userId ?? ""}</strong>
                    <span className="text-gray-500">
                      {comment.createdAt.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 text-sm">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            aria-label={isEditing ? "Cancelar edición" : "Editar tarea"}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
          
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Guardar cambios"
            >
              Guardar
            </button>
          )}
          
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;