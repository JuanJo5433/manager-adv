import { createTask } from "@/services/proccesses/tasks";
import { useState } from "react";
import { CiCalendar } from "react-icons/ci";

const CreateTaskModal = ({ onClose, processId, setTasks }) => {
  // Estado inicial para nueva tarea usando el processId recibido
  const [newTask, setNewTask] = useState({
    title: "A",
    description: "eeeeeeeee",
    status: 0,
    priority: "medium",
    deadline: null,
    process: {
      connect: { id: processId }
    },
    user: {
      connect: { id: "3471e6d7-7193-4478-943e-85fc0137f619" }
    },
    comments: {}
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
      // Actualiza el id del usuario en la conexión
      setNewTask((prev) => ({
        ...prev,
        user: {
          connect: { id: value }
        }
      }));
    } else if (name === "status") {
      // Convierte a número el estado
      setNewTask((prev) => ({
        ...prev,
        status: parseInt(value, 10)
      }));
    } else if (name === "deadline") {
      setNewTask((prev) => ({
        ...prev,
        deadline: value
      }));
    } else {
      setNewTask((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejar la creación de la tarea
  const handleCreate = async () => {
    console.log(newTask);
    const result = await createTask(newTask);
    // Actualiza el estado de tareas en el componente padre
    setTasks((prevTasks) => [...prevTasks, result]);
    onClose();
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
          />
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <strong>Descripción</strong>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Añadir descripción..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <div>
              <strong>Estado</strong>
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>Pendiente</option>
                <option value={1}>En Progreso</option>
                <option value={2}>Completado</option>
                <option value={3}>Cancelado</option>
              </select>
            </div>

            <div>
              <strong>Prioridad</strong>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg"
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
              value={newTask.deadline || ""}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <strong>Asignado a</strong>
            <input
              type="text"
              name="userId"
              value={newTask.user.connect.id}
              onChange={handleInputChange}
              placeholder="ID del usuario asignado"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Crear tarea
          </button>
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

export default CreateTaskModal;
