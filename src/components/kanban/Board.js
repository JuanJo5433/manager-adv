import { useEffect, useState, useCallback } from "react";
import KanbanColumn from "./Column";
import TaskDetailsModal from "./TaskDetailsModal";
import { getProccesById } from "@/services/proccesses/procces/proccesService";
import { getUserById } from "@/services/users/user/userService";
import CreateTaskModal from "./CreateTaskModal";

// Componente funcional KanbanBoard que recibe como prop el id del proceso
const KanbanBoard = ({ id }) => {
  // Estados
  const [procces, setProcces] = useState(null); // Almacena la información del proceso
  const [tasks, setTasks] = useState([]); // Lista de tareas asociadas al proceso
  const [draggedTaskId, setDraggedTaskId] = useState(null); // ID de la tarea arrastrada
  const [draggedOverColumn, setDraggedOverColumn] = useState(null); // Estado de la columna sobre la cual se arrastra la tarea
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal de detalles/edición de tarea
  const [isModalCreteOpen, setIsModalCreteOpen] = useState(false); // Controla la visibilidad del modal de detalles/edición de tarea
  const [currentTask, setCurrentTask] = useState(null); // Tarea actualmente seleccionada (para ver detalles o editar)

 

  // useEffect para obtener el proceso y sus tareas al montar el componente o cuando cambia el id
  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        // Verifica si el id es válido
        if (!id) return;

        // Obtiene el proceso por su id
        const result = await getProccesById(id);

        if (result && result.length > 0) {
          const processData = result[0];
          // Obtiene el usuario relacionado al proceso (por ejemplo, el creador)
          const user = await getUserById(processData.userId);
          // Actualiza el estado del proceso y sus tareas, añadiendo la información del usuario a cada tarea
          setProcces(processData);
          setTasks(
            (processData.tasks || []).map((task) => ({ ...task, user }))
          );
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchProcessData();
  }, [id]);

  // Definición de las columnas del tablero Kanban con título, status y color de borde
  const columns = [
    { title: "Pendiente", status: 0, color: "border-yellow-400" },
    { title: "En Progreso", status: 1, color: "border-blue-400" },
    { title: "Completado", status: 2, color: "border-green-400" },
    { title: "Cancelado", status: 3, color: "border-red-400" },
  ];

  // Función para abrir el modal con la tarea seleccionada
  const openModalWithTask = useCallback((task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  }, []);

  // Función que se ejecuta al iniciar el arrastre de una tarea
  const handleDragStart = useCallback((taskId) => {
    setDraggedTaskId(taskId);
  }, []);

  // Función que se ejecuta cuando una tarea se arrastra sobre una columna
  const handleDragOver = useCallback((e, columnStatus) => {
    e.preventDefault(); // Prevenir comportamiento por defecto para permitir el drop
    setDraggedOverColumn(columnStatus);
  }, []);

  // Función que se ejecuta al soltar la tarea en una columna
  const handleDrop = useCallback(
    (columnStatus) => {
      // Si no hay una tarea arrastrada, no se hace nada
      if (!draggedTaskId) return;

      // Actualiza el estado de las tareas modificando el status de la tarea arrastrada
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTaskId ? { ...task, status: columnStatus } : task
        )
      );
      // Reinicia los estados de la tarea arrastrada y la columna destino
      setDraggedTaskId(null);
      setDraggedOverColumn(null);
    },
    [draggedTaskId]
  );

  // Función para eliminar una tarea del estado
  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  // Función para iniciar la edición de una tarea
  const handleEditTask = useCallback(
    (task) => {
      openModalWithTask(task);
    },
    [openModalWithTask]
  );

  // Función para ver los detalles de una tarea
  const handleViewDetails = useCallback(
    (task) => {
      openModalWithTask(task);
    },
    [openModalWithTask]
  );

  // Función para iniciar la creación de una nueva tarea
  const handleCreateTask = useCallback(() => {

    setIsModalCreteOpen(true);
    // Aquí se podría abrir el modal para crear la tarea si se desea
  }, [isModalCreteOpen]);

  // Función para guardar una tarea: actualiza la existente o agrega una nueva
  const handleSaveTask = useCallback((updatedTask) => {
    setTasks((prevTasks) => {
      // Verifica si la tarea ya existe en el estado (por su id)
      const taskExists = prevTasks.some((task) => task.id === updatedTask.id);
      if (taskExists) {
        // Si existe, se actualiza la tarea
        return prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      // Si no existe, se agrega como una nueva tarea con un ID temporal
      return [...prevTasks, { ...updatedTask, id: Date.now() }];
    });
    // Cierra el modal tras guardar la tarea
    setIsModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col gap-8 px-20">
        {/* Encabezado: muestra el título del proceso y un botón para crear una nueva tarea */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {procces?.title || "Proceso"}
          </h2>
          <button
            onClick={handleCreateTask}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Crear Tarea
          </button>
        </div>

        {/* Sección de columnas del tablero Kanban */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              column={column}
              // Filtra las tareas que pertenecen a la columna según su status
              tasks={tasks.filter((task) => task.status === column.status)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggedOverColumn={draggedOverColumn}
              onDragStart={handleDragStart}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Modal para ver detalles o editar la tarea actual; se muestra si isModalOpen es true */}
      {isModalOpen && currentTask && (
        <TaskDetailsModal
          task={currentTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
      {/* Modal para ver detalles o editar la tarea actual; se muestra si isModalOpen es true */}
      {isModalCreteOpen  && (
        <CreateTaskModal
          onClose={() => setIsModalCreteOpen(false)}
          processId={id}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
