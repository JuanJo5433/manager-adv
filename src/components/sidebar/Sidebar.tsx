import { useState, useEffect, FC, JSX } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { GrFolderCycle } from "react-icons/gr";
import { Session } from "next-auth";
import React from "react";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  href: string;
}

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const icons: Record<string, JSX.Element> = {
    home: <GoHome />,
    analytics: <IoAnalyticsOutline />,
    users: <FiUsers />,
    products: <AiOutlineProduct />,
    process: <GrFolderCycle />,
    settings: <IoSettingsOutline />,
  };

  const menuItems: MenuItem[] = [
    { name: "Inicio", icon: icons.home, href: "#" },
    { name: "Analíticas", icon: icons.analytics, href: "#" },
    { name: "Clientes", icon: icons.users, href: "/dashboard/clients" },
    { name: "Productos", icon: icons.products, href: "/dashboard/products" },
    { name: "Procesos", icon: icons.process, href: "/dashboard/processes" },
    { name: "Configuración", icon: icons.settings, href: "#" },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
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

        <div className="flex items-center border-b p-4">
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
          <span
            className={`ml-3 text-lg font-medium text-gray-800 ${
              !isOpen && "hidden"
            }`}
          >
            Dashboard
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg p-3 text-gray-600 hover:bg-gray-50 transition-colors
                    ${isOpen ? "justify-start" : "justify-center"}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`ml-3 text-sm font-medium ${!isOpen && "hidden"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4">
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
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
            <div className={`ml-3 ${!isOpen && "hidden"}`}>
              <p className="text-sm font-medium text-gray-700">
                {(session as Session)?.user?.name || "Usuario"}
              </p>
              <p className="text-xs text-gray-500">
                {(session as Session)?.user?.email || "Admin"}
              </p>
            </div>
          </div>
          
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
            <span className={`${!isOpen && "hidden"}`}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;