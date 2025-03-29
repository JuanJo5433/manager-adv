import { useEffect, useState, useCallback, useMemo } from "react";
import KanbanColumn from "./Column";
import TaskDetailsModal from "./TaskDetailsModal";
import CreateTaskModal from "./CreateTaskModal";
import { getUserById } from "@/services/users/user/userService";
import { getProcessById } from "@/services/processes/process/processService";
import { Process, Task, Users } from "../../utils/types/types";
import { useRouter } from "next/router";
import { editTask } from "@/services/processes/tasks";

// Constantes para columnas del Kanban
const KANBAN_COLUMNS = [
    { title: "Pendiente", status: 0, color: "border-yellow-400" },
    { title: "En Progreso", status: 1, color: "border-blue-400" },
    { title: "Completado", status: 2, color: "border-green-400" },
    { title: "Cancelado", status: 3, color: "border-red-400" },
] as const;

const KanbanBoard = () => {
    // Se utiliza el hook useRouter para acceder a los parámetros de la URL
    const router = useRouter();
    
    // Se extrae el parámetro "ref" de la query string, que representa el ID del proceso
    const id = router.query.Id as string;
    // Estados del componente
    const [process, setProcess] = useState<Process | null>(null);

    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [draggedOverColumn, setDraggedOverColumn] = useState<number | null>(
        null
    );
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [modals, setModals] = useState({
        details: false,
        create: false,
    });

    // Memoizar tareas filtradas por columna
    const getColumnTasks = useCallback(
        (status: number) =>
            process?.tasks.filter((task) => task.status === status) || [],
        [process?.tasks]
    );

    /**
     * Transformar datos del proceso y obtener usuarios asociados a las tareas
     */
    const fetchAndTransformProcessData = useCallback(
        async (processId: string) => {
            try {
                const result = await getProcessById(processId);
                console.log("🚀 ~ result:", result);

                if (!result || !result.tasks)
                    throw new Error("Datos del proceso inválidos");


                // 1. Obtener detalles de usuarios manteniendo las propiedades del proceso
                const enrichedUsers = await Promise.all(
                    result.users?.map(async (processUser) => {
                        try {
                            const user = await getUserById(processUser.userId);
                            return {
                                // Añadimos detalles completos
                                id: user[0].id,
                                email: user[0].email,
                                username: user[0].username,
                                name: user[0].name,
                            };
                        } catch (error) {
                            console.error("Error obteniendo usuario:", error);
                            return processUser; // Retornamos la estructura original si falla
                        }
                    }) || []
                );


                // 2. Asignar usuarios a tareas
                const tasksWithUsers = result.tasks.map((task) => ({
                    ...task,
                    user:
                        enrichedUsers.find((u) => u.id === task.userId) || null,
                }));


                // 3. Retornar proceso con tipos correctos
                return {
                    ...result,
                    tasks: tasksWithUsers,
                    users: enrichedUsers, // Conserva la estructura ProcessUsers + User
                } as Process; // Aseguramos el tipo correcto
            } catch (error) {
                console.error("Error procesando datos del proceso:", error);
                return null;
            }
        },
        []
    );

    // Cargar datos iniciales
    useEffect(() => {
        const loadProcessData = async () => {
            try {
                if (!id) return;

                const data = await fetchAndTransformProcessData(id);
                if (!data) return;

                setProcess(data);
            } catch (error) {
                console.error("Error cargando el proceso:", error);
            }
        };

        loadProcessData();
    }, [id, fetchAndTransformProcessData]);

    /**
     * Manejar el arrastre y soltado de tareas
     */
    const handleTaskMove = useCallback(
        (columnStatus: number) => {
            if (!draggedTaskId) return;
            const updateStatus = async (): Promise<void> => {
                const statusUpdate: { id: string; status: number } = {
                    id: draggedTaskId,
                    status: columnStatus,
                };
                editTask(statusUpdate);
            };
            updateStatus();
            setProcess((prevProcessTask) => {
                if (!prevProcessTask) return prevProcessTask;
                return {
                    ...prevProcessTask,
                    tasks: prevProcessTask.tasks.map((task) =>
                        task.id === draggedTaskId
                            ? { ...task, status: columnStatus }
                            : task
                    ),
                };
            });

            // Resetear estados de arrastre
            setDraggedTaskId(null);
            setDraggedOverColumn(null);
        },
        [draggedTaskId]
    );

    // /**
    //  * Manejar la persistencia de cambios en tareas
    //  */
    // const persistTaskChanges = useCallback((updatedTask: Task) => {
    //     setTasks((prevTasks) => {
    //         const exists = prevTasks.some((t) => t.id === updatedTask.id);

    //         return exists
    //             ? prevTasks.map((t) =>
    //                   t.id === updatedTask.id ? updatedTask : t
    //               )
    //             : [
    //                   ...prevTasks,
    //                   {
    //                       ...updatedTask,
    //                       id: crypto.randomUUID(), // Mejor método para IDs únicos
    //                   },
    //               ];
    //     });
    // }, []);

    // Manejar apertura/cierre de modales
    const toggleModal = useCallback(
        (modal: keyof typeof modals, state: boolean) => {
            setModals((prev) => {
                console.log(`Cambiando modal ${modal} a:`, state);
                return { ...prev, [modal]: state };
            });
        },
        []
    );

    /**
     * Manejar acciones de tareas
     */
    const taskActions = useMemo(
        () => ({
            delete: (taskId: string) =>
                setProcess((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        tasks: prev.tasks.filter((t) => t.id !== taskId),
                    };
                }),
            edit: (task: Task) => {
                setCurrentTask(task);
                toggleModal("details", true);
            },
            view: (task: Task) => {
                setCurrentTask(task);
                toggleModal("details", true);
            },
            create: () => toggleModal("create", true),
        }),
        [toggleModal]
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex flex-col gap-8 px-20">
                {/* Header del tablero */}
                <header className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        {process?.title || "Cargando proceso..."}
                    </h2>
                    <div className="flex gap-5">
                        <button
                            onClick={taskActions.create}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            aria-label="Crear nueva tarea"
                        >
                            Crear Tarea
                        </button>
                        <button
                            onClick={() => router.push(`/dashboard/processes/details/${id}`)}
                            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                            aria-label="Crear nueva tarea"
                        >
                            Ver detalles
                        </button>
                    </div>
                </header>

                {/* Columnas del Kanban */}
                <section className="flex gap-4 overflow-x-auto pb-4">
                    {KANBAN_COLUMNS.map((column) => (
                        <KanbanColumn
                            key={column.status}
                            column={column}
                            tasks={getColumnTasks(column.status)}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDraggedOverColumn(column.status);
                            }}
                            onDrop={() => handleTaskMove(column.status)}
                            draggedOverColumn={draggedOverColumn}
                            onDragStart={setDraggedTaskId}
                            onDelete={taskActions.delete}
                            onEdit={taskActions.edit}
                            onViewDetails={taskActions.view}
                        />
                    ))}
                </section>
            </div>
            {modals.details && currentTask && process && (
                <TaskDetailsModal
                    task={currentTask}
                    setTask={setCurrentTask}
                    onClose={() => toggleModal("details", false)}
                    onSave={async (updatedTask) => {

                       
                        // Actualizamos el estado de las tareas incluyendo la nueva tarea enriquecida.
                        setProcess((prevProcess) => {
                            if (!prevProcess) return prevProcess;
                            const updatedTasks = prevProcess.tasks.map((task) =>
                                task.id === updatedTask.id ? updatedTask : task
                            );
                            return {
                                ...prevProcess,
                                tasks: updatedTasks, // Se actualiza correctamente la tarea
                            };
                        });
                    }}
                    process={process}

                />
            )}

            {modals.create && process && (
                <CreateTaskModal
                    onClose={() => toggleModal("create", false)}
                    onSave={async (newTask) => {
                        // Si la nueva tarea tiene un userId, obtenemos los datos del usuario.
                        if (newTask.userId) {
                            const userWithoutSensitiveData = await getUserById(
                                newTask.userId
                            );
                            newTask = {
                                ...newTask,
                                user: userWithoutSensitiveData as unknown as Users,
                            };
                        }

                        // Actualizamos el estado de las tareas incluyendo la nueva tarea enriquecida.
                        setProcess((prevProcess) => {
                            if (!prevProcess) return prevProcess;

                            return {
                                ...prevProcess,
                                tasks: [...prevProcess.tasks, newTask], // Se agrega correctamente la nueva tarea
                            };
                        });
                    }}
                    process={process}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
