import ModernLogin from "./signin";
import React from "react";

// // Configuración de la fuente Geist Sans
// const geistSans = Geist({
//     variable: "--font-geist-sans", // Define una variable CSS para la fuente
//     subsets: ["latin"], // Especifica los subconjuntos de caracteres a incluir
// });

// // Configuración de la fuente Geist Mono
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono", // Define una variable CSS para la fuente
//     subsets: ["latin"], // Especifica los subconjuntos de caracteres a incluir
// });

// Componente principal de la página de inicio
const Home: React.FC = () => {
    return <ModernLogin />; // Renderiza el componente ModernLogin
};

export default Home;