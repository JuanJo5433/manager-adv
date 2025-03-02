import KanbanBoard from "@/components/kanban/Board";
import Sidebar from "@/components/sidebar/Sidebar";
import { useRouter } from "next/router";

// Componente principal del tablero Kanban
const boardProcess = () => {
  // Se utiliza el hook useRouter para acceder a los parámetros de la URL
  const router = useRouter();
  // Se extrae el parámetro "ref" de la query string, que representa el ID del proceso
  const ref = router.query.ref;

  return (
    // Contenedor principal con fondo gris claro y padding
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Componente Sidebar para la navegación lateral */}
      <Sidebar />
      {/* Se renderiza el tablero Kanban pasando el ID del proceso obtenido de la URL */}
      <KanbanBoard id={ref} />
    </div>
  );
};

export default boardProcess;
