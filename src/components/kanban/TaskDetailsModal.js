import { useState } from "react";
import { CiCalendar } from "react-icons/ci";

// Componente modal para mostrar y editar detalles de una tarea.
// Recibe tres props:
// - task: objeto con los detalles de la tarea.
// - onClose: función para cerrar el modal.
// - onSave: función para guardar los cambios realizados en la tarea.
const TaskDetailsModal = ({ task, onClose, onSave }) => {
  // Estado para controlar si el modo edición está activo o no.
  const [isEditing, setIsEditing] = useState(false);
  // Estado que almacena los cambios realizados a la tarea.
  // Inicialmente se establece con los datos de la tarea recibida.
  const [editedTask, setEditedTask] = useState(task);

  // Función que se ejecuta cuando se modifica algún input del formulario.
  // Actualiza el estado 'editedTask' con el valor del campo modificado.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los cambios de la tarea.
  // Invoca la función onSave pasada como prop con la tarea editada y desactiva el modo edición.
  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  return (
    // Contenedor del modal: posición fija, oscurece el fondo y centra el contenido.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      {/* Contenedor principal del contenido del modal */}
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
        {/* Título de la tarea */}
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? (
            // Si se está editando, se muestra un input para modificar el título.
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          ) : (
            // En modo visualización, se muestra el título tal cual.
            task.title
          )}
        </h2>
        {/* Contenedor para el contenido del modal */}
        <div className="space-y-4">
          {/* Sección de descripción de la tarea */}
          <div className="flex flex-col">
            <strong>Descripción</strong>{" "}
            {isEditing ? (
              // Si se edita, se muestra un textarea para modificar la descripción.
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              // Si no se edita, se muestra la descripción en texto.
              <p className="text-gray-500 text-sm">{task.description}</p>
            )}
          </div>

          {/* Sección que agrupa estado y prioridad */}
          <div className="flex gap-4">
            {/* Sección de estado de la tarea */}
            <div>
              <strong>Estado</strong>{" "}
              {isEditing ? (
                // Si se edita, se muestra un select para elegir el estado de la tarea.
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>Pendiente</option>
                  <option value={1}>En Progreso</option>
                  <option value={2}>Completado</option>
                  <option value={3}>Cancelado</option>
                </select>
              ) : (
                // Si no se edita, se muestra el estado con un estilo visual.
                <div className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded-lg">
                  {task.status === 1
                    ? "En Progreso"
                    : task.status === 2
                    ? "Completado"
                    : task.status === 3
                    ? "Cancelado"
                    : "Pendiente"}
                </div>
              )}
            </div>

            {/* Sección de prioridad de la tarea */}
            <div>
              <strong>Prioridad</strong>{" "}
              {isEditing ? (
                // Si se edita, se muestra un select para elegir la prioridad.
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              ) : (
                // Si no se edita, se muestra la prioridad con un fondo que varía según el valor.
                <div
                  className={`text-sm ${
                    task.priority === "low"
                      ? "bg-green-100"
                      : task.priority === "medium"
                      ? "bg-amber-100"
                      : "bg-red-100"
                  } px-2 py-1 rounded-lg`}
                >
                  <p className="text-center">{task.priority}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sección de fecha límite */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <strong>Fecha límite</strong>
              {/* Icono de calendario */}
              <CiCalendar className="text-lg" />
            </div>{" "}
            {isEditing ? (
              // Si se edita, se muestra un input de tipo fecha.
              <input
                type="date"
                name="deadline"
                value={
                  editedTask.deadline
                    ? editedTask.deadline.toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg"
              />
            ) : task.deadline ? (
              // Si existe una fecha límite y no se edita, se muestra la fecha formateada.
              <p className="text-gray-500 text-sm">
                {new Date(task.deadline).toLocaleDateString()}{" "}
              </p>
            ) : (
              // Si no hay fecha límite, se muestra un mensaje indicativo.
              <p className="text-gray-500 text-sm">No hay fecha límite</p>
            )}
          </div>

          {/* Sección de asignación de usuario */}
          <div>
            <strong>Asignado a</strong>{" "}
            {isEditing ? (
              // Si se edita, se muestra un input para cambiar el id del usuario asignado.
              // En una aplicación real, probablemente se usaría un selector con los usuarios disponibles.
              <input
                type="text"
                name="assignee"
                value={editedTask.userId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              // Si no se edita, se muestra el nombre del usuario asignado.
              <p className="text-gray-500">{task.user[0].username}</p>
            )}
          </div>

          {/* Sección de comentarios */}
          <div>
            <strong>Comentarios</strong>{" "}
            {/* Se recorre el arreglo de comentarios y se muestra cada uno */}
            {task.comments.map((comment) => (
              <div
                key={comment.id}
                className="w-auto my-1 h-auto border border-gray-200 rounded-lg p-2"
              >
                {/* Encabezado del comentario con el nombre del autor y la fecha */}
                <div className="flex gap-2 items-center">
                  <strong className="text-sm">{comment.createdBy}</strong>
                  <p className="text-gray-500 text-xs">
                    {((d) =>
                      `${d.getUTCDate()} ${d.toLocaleString("en-US", {
                        month: "short",
                      })}, ${d.getUTCFullYear()}`)(new Date(comment.createdAt))}
                  </p>
                </div>
                {/* Cuerpo del comentario */}
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de botones en el pie del modal */}
        <div className="flex justify-end gap-2 mt-6">
          {/* Botón para alternar entre modo edición y visualización */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isEditing ? "Cancelar Edición" : "Editar"}
          </button>
          {/* Botón para guardar los cambios solo visible en modo edición */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Guardar Cambios
            </button>
          )}
          {/* Botón para cerrar el modal */}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
