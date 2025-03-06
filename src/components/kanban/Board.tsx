import { useEffect, useState, useCallback, FC } from "react";
import KanbanColumn from "./Column";
import TaskDetailsModal from "./TaskDetailsModal";
import { getUserById } from "@/services/users/user/userService";
import CreateTaskModal from "./CreateTaskModal";
import { getProcessById } from "@/services/processes/process/processService";
import React from "react";
import { Process, Task, Users } from "../../utils/types/types";

interface Column {
  title: string;
  status: number;
  color: string;
}

interface KanbanBoardProps {
  id: string;
}

const KanbanBoard: FC<KanbanBoardProps> = ({ id }) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        if (!id) return;
        // Se obtiene el resultado (asumido como any porque puede venir incompleto)
        const result: any = await getProcessById(id);

        // Transformamos el objeto para que cumpla con la interfaz Process
        const processData: Process = {
          createdAt: result.createdAt,
          id: result.id,
          title: result.title,
          slug: result.slug || "", // valor por defecto si falta
          clientId: result.clientId || null,
          client: result.client || null,
          userId: result.userId || "",
          // Si result.user no viene, tratamos de obtenerlo; de lo contrario asignamos un objeto Users vacío (ajusta según convenga)
          user: result.user || (await getUserById(result.userId)) || {
            id: "",
            email: "",
            password: "",
            Process: [],
            Task: [],
            comments: [],
          } as Users,
          products: result.products || [],
          status: result.status,
          tasks: result.tasks || [],
        };

        setProcess(processData);

        // Actualizamos las tareas obteniendo el usuario de forma asíncrona para cada tarea
        const updatedTasks = await Promise.all(
          (processData.tasks || []).map(async (task: Task) => {
            const user = await getUserById(processData.userId);
            const userData: Users = {
              ...user,
              password: "",
              Process: [],
              Task: [],
              comments: [],
            };
            return {
              ...task,
              user: userData,
            };
          })
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchProcessData();
  }, [id]);

  const columns: Column[] = [
    { title: "Pendiente", status: 0, color: "border-yellow-400" },
    { title: "En Progreso", status: 1, color: "border-blue-400" },
    { title: "Completado", status: 2, color: "border-green-400" },
    { title: "Cancelado", status: 3, color: "border-red-400" },
  ];

  const openModalWithTask = useCallback((task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnStatus: number) => {
    e.preventDefault();
    setDraggedOverColumn(columnStatus);
  }, []);

  const handleDrop = useCallback((columnStatus: number) => {
    if (!draggedTaskId) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === draggedTaskId ? { ...task, status: columnStatus } : task
      )
    );
    setDraggedTaskId(null);
    setDraggedOverColumn(null);
  }, [draggedTaskId]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    openModalWithTask(task);
  }, [openModalWithTask]);

  const handleViewDetails = useCallback((task: Task) => {
    openModalWithTask(task);
  }, [openModalWithTask]);

  const handleCreateTask = useCallback(() => {
    setIsModalCreateOpen(true);
  }, []);

  const handleSaveTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => {
      const taskExists = prevTasks.some(task => task.id === updatedTask.id);
      return taskExists
        ? prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        : [...prevTasks, { ...updatedTask, id: Date.now().toString() }];
    });
    setIsModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col gap-8 px-20">
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {process?.title || "Proceso"}
          </h2>
          <button
            onClick={handleCreateTask}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Crear Tarea
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              column={column}
              tasks={tasks.filter(task => task.status === column.status)}
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

      {isModalOpen && currentTask && (
        <TaskDetailsModal
          task={currentTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}

      {isModalCreateOpen && (
        <CreateTaskModal
          onClose={() => setIsModalCreateOpen(false)}
          processId={id}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
