// Importaciones necesarias
import KanbanBoard from "@/components/kanban/Board";
import Sidebar from "@/components/sidebar/Sidebar";
import { useRouter } from "next/router";
import React from 'react';

/**
 * Componente principal del tablero Kanban.
 * Este componente muestra un tablero Kanban para un proceso específico,
 * utilizando el ID del proceso obtenido de la URL.
 */
const BoardProcess: React.FC = () => {
  // Se utiliza el hook useRouter para acceder a los parámetros de la URL
  const router = useRouter();
  // Se extrae el parámetro "ref" de la query string, que representa el ID del proceso
  const ref = router.query.ref as string;

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

export default BoardProcess;