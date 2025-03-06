import { useSession, signIn, signOut } from "next-auth/react";
// Importamos el tipo Session de next-auth para el tipado de la sesión
import React from "react";

/**
 * Componente funcional que maneja la autenticación con NextAuth.
 * Muestra el estado de sesión del usuario y permite iniciar o cerrar sesión.
 * 
 */
const AuthComponent: React.FC = () => {
  // useSession devuelve un objeto session con tipado seguro
  // Desestructuramos data renombrandola como session para mayor claridad
  const { data: session } = useSession();

  // El tipo Session de NextAuth incluye user pero lo validamos con optional chaining
  if (session) {
    return (
      <div>
        {/* Accedemos al email de forma segura con optional chaining */}
        <p>Signed in as {session.user?.email}</p>
        {/* signOut no requiere parámetros pero TypeScript valida su ejecución correcta */}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      {/* signIn puede recibir opciones pero aquí usamos la configuración por defecto */}
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

export default AuthComponent;