import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

// Define el componente Document, que es el punto de entrada para personalizar el documento HTML de la aplicación
const Document: React.FC = () => {
  return (
    // Define el elemento raíz <html> con el atributo lang establecido en "en" (inglés)
    <Html lang="en">
      {/* Componente Head para agregar metadatos, estilos globales, etc. */}
      <Head />
      {/* Cuerpo del documento con la clase antialiased para mejorar la renderización de fuentes */}
      <body className="antialiased">
        {/* Componente Main que renderiza el contenido de la página actual */}
        <Main />
        {/* Componente NextScript que incluye los scripts necesarios para Next.js */}
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;