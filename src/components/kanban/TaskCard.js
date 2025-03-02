import { CiCalendar } from "react-icons/ci";
import { VscComment } from "react-icons/vsc";
import { FaUser } from "react-icons/fa";

// Componente funcional TaskCard: representa una tarjeta que muestra información de una tarea.
const TaskCard = ({ task, onDragStart, onViewDetails }) => {
  console.log("🚀 ~ TaskCard ~ task:", task)
  
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={() => onViewDetails(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
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
            {task.priority}
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
          ) : (
            new Date(task.deadline).toLocaleDateString()
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
          <p>{task.user[0]?.username || "Sin asignar"}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
