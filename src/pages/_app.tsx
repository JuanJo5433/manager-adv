import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app"; // Importa el tipo AppProps de Next.js
import "@/styles/globals.css"; // Importa tus estilos globales
import React from "react";
// Define el componente principal de la aplicación
function App({ Component, pageProps }: AppProps) {
  return (
    // Envuelve la aplicación con el SessionProvider para manejar la sesión de autenticación
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;