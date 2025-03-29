// Importaciones necesarias
import KanbanBoard from "@/components/kanban/Board";
import Sidebar from "@/components/sidebar/Sidebar";
import React from 'react';

/**
 * Componente principal del tablero Kanban.
 * Este componente muestra un tablero Kanban para un proceso específico,
 */
const BoardProcess: React.FC = () => {

  return (
    // Contenedor principal con fondo gris claro y padding
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Componente Sidebar para la navegación lateral */}
      <Sidebar />
      {/* Se renderiza el tablero Kanban pasando el ID del proceso obtenido de la URL */}
      <KanbanBoard />
    </div>
  );
};

export default BoardProcess;