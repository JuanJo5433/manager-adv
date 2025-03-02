import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { GrFolderCycle } from "react-icons/gr";

// Componente Sidebar que muestra el menú de navegación y la información del usuario.
const Sidebar = () => {
  // Estado para controlar si el sidebar está abierto o cerrado.
  const [isOpen, setIsOpen] = useState(true);
  // Estado para determinar si la vista es en dispositivo móvil (ancho menor a 768px).
  const [isMobile, setIsMobile] = useState(false);
  // Obtiene la sesión del usuario actual con NextAuth.
  const { data: session } = useSession();

  // useEffect para ajustar el comportamiento del sidebar según el tamaño de la ventana.
  useEffect(() => {
    // Función que maneja el cambio de tamaño de la ventana.
    const handleResize = () => {
      // Si el ancho de la ventana es menor a 768px, se considera móvil.
      setIsMobile(window.innerWidth < 768);
      // Si el ancho es mayor o igual a 768px, el sidebar se muestra abierto.
      setIsOpen(window.innerWidth >= 768);
    };

    // Llama la función de resize inicialmente.
    handleResize();
    // Agrega el listener para el evento 'resize'.
    window.addEventListener("resize", handleResize);
    // Remueve el listener cuando el componente se desmonta.
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para alternar el estado del sidebar (abierto/cerrado).
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Objeto que contiene los iconos SVG reutilizables para el menú.
  const icons = {
    home: <GoHome />,
    analytics: <IoAnalyticsOutline />,
    users: <FiUsers />,
    products: <AiOutlineProduct />,
    process: <GrFolderCycle />,
    settings: <IoSettingsOutline />,
  };

  return (
    <>
      {/* Fondo semitransparente para dispositivos móviles:
          Se muestra cuando el sidebar está abierto y al hacer clic cierra el sidebar. */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      {/* Componente <aside> que representa el sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}`}
      >
        {/* Botón para alternar el sidebar, ubicado en la parte superior derecha del sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
        >
          <svg
            className={`h-6 w-6 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Encabezado del sidebar: incluye el logo y el título del Dashboard */}
        <div className="flex items-center border-b p-4">
          {/* Logo: se muestra como un ícono en un fondo oscuro */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800 text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          {/* Título del Dashboard: se oculta cuando el sidebar está cerrado */}
          <span
            className={`ml-3 text-lg font-medium text-gray-800 ${
              !isOpen && "hidden"
            }`}
          >
            Dashboard
          </span>
        </div>
        {/* Menú de navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {/* Mapeo de elementos del menú. Cada elemento tiene un nombre, un icono y una ruta (href) */}
            {[
              { name: "Inicio", icon: icons.home, href: "#" },
              { name: "Analíticas", icon: icons.analytics, href: "#" },
              { name: "Clientes", icon: icons.users, href: "/dashboard/clients" },
              { name: "Productos", icon: icons.products, href: "/dashboard/products" },
              { name: "Procesos", icon: icons.process, href: "/dashboard/processes" },
              { name: "Configuración", icon: icons.settings, href: "#" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg p-3 text-gray-600 hover:bg-gray-50 transition-colors
                    ${isOpen ? "justify-start" : "justify-center"}`}
                >
                  {/* Ícono del elemento del menú */}
                  <span className="flex-shrink-0">{item.icon}</span>
                  {/* Nombre del elemento del menú: se oculta si el sidebar está cerrado */}
                  <span className={`ml-3 text-sm font-medium ${!isOpen && "hidden"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Sección inferior del sidebar: muestra la información del usuario y el botón de cerrar sesión */}
        <div className="border-t p-4">
          {/* Información del usuario */}
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
            {/* Avatar del usuario (representado con un SVG genérico) */}
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            {/* Nombre y correo del usuario: se muestran solo si el sidebar está abierto */}
            <div className={`ml-3 ${!isOpen && "hidden"}`}>
              <p className="text-sm font-medium text-gray-700">
                {session?.user?.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email || "Admin"}
              </p>
            </div>
          </div>
          {/* Botón de Cerrar Sesión */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`w-full mt-4 flex items-center justify-center p-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors
      ${!isOpen && "justify-center"}`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {/* Texto del botón: se oculta si el sidebar está cerrado */}
            <span className={`${!isOpen && "hidden"}`}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
