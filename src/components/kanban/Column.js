import TaskCard from "./TaskCard";

// Componente funcional KanbanColumn: representa una columna individual en el tablero Kanban.
// Recibe las siguientes props:
// - column: objeto que contiene datos de la columna (título, estado, color, etc.).
// - tasks: arreglo de tareas a mostrar.
// - onDragOver: función que se ejecuta cuando se arrastra un elemento sobre la columna.
// - onDrop: función que se ejecuta cuando se suelta un elemento en la columna.
// - draggedOverColumn: valor que indica cuál columna está siendo sobrevolada actualmente.
// - onDragStart: función que se ejecuta al iniciar el arrastre de una tarea.
// - onDelete: función para eliminar una tarea.
// - onEdit: función para editar una tarea.
// - onViewDetails: función para ver los detalles de una tarea.
const KanbanColumn = ({
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
    // Contenedor de la columna con estilos de Tailwind CSS:
    // - flex-1: permite que la columna ocupe el espacio disponible.
    // - min-w-[300px]: ancho mínimo de 300px.
    // - mx-5: margen horizontal.
    // - rounded-lg, p-4, border-t-4, bg-white, shadow-lg: estilos visuales.
    // - ${column.color}: aplica el color específico definido en la columna.
    // - ${draggedOverColumn === column.status ? "opacity-75" : ""}: reduce la opacidad si es la columna sobre la que se está arrastrando una tarea.
    <div
      className={`flex-1 min-w-[300px] mx-5 rounded-lg p-4 border-t-4 bg-white shadow-lg 
           ${column.color} ${draggedOverColumn === column.status ? "opacity-75" : ""}`}
      // Evento onDragOver: se invoca la función onDragOver pasando el evento y el status de la columna.
      onDragOver={(e) => onDragOver(e, column.status)}
      // Evento onDrop: se invoca la función onDrop pasando el status de la columna.
      onDrop={() => onDrop(column.status)}
    >
      {/* Encabezado de la columna:
          Muestra el título de la columna y, entre paréntesis, la cantidad de tareas que coinciden con el estado de la columna. */}
      <h2 className="text-lg font-semibold mb-4">
        {column.title} (
        {tasks.filter((t) => t.status === column.status).length})
      </h2>

      {/* Contenedor para las tarjetas de tareas con un espacio vertical entre cada una */}
      <div className="space-y-3">
        {/* Se filtran las tareas que tienen el mismo status que la columna y se mapea cada tarea para renderizar un TaskCard */}
        {tasks
          .filter((task) => task.status === column.status)
          .map((task) => (
            <TaskCard
              key={task.id} // Clave única para cada tarea
              task={task} // Se pasa la tarea como prop
              onDragStart={onDragStart} // Función para manejar el inicio del arrastre de la tarea
              onDelete={onDelete}       // Función para eliminar la tarea
              onEdit={onEdit}           // Función para editar la tarea
              onViewDetails={onViewDetails} // Función para ver los detalles de la tarea
            />
          ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
