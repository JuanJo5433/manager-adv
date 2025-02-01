import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css"; // Importa tus estilos globales

function App({ Component, pageProps }) {
  return (
    // Envuelve la aplicación con el SessionProvider
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;