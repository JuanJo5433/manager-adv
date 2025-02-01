"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

export default function ModernLogin() {
    const [credentials, setCredentials] = useState({ identifier: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
    
      const res = await signIn("credentials", {
        redirect: false,
        identifier: credentials.identifier.trim(),
        password: credentials.password,
      });
    
      console.log("Resultado de signIn:", res); // Verifica la respuesta
    
      setLoading(false);
    
      if (res?.error) {
        console.error("Error en la respuesta de signIn:", res.error);  // Añadir log de errores
        setError(res.error); // Muestra el error específico del servidor
        return;
      }
    
      // Redirigir al dashboard si el login es exitoso
      router.push("/dashboard/clients");
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
                    <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="group text-slate-900">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usuario o Correo
                        </label>
                        <input
                            type="text"
                            value={credentials.identifier}
                            onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="Ejemplo: usuario123 o correo@email.com"
                        />
                    </div>

                    <div className="group text-slate-900">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        } text-white py-3.5 px-6 rounded-lg font-medium transition-all transform hover:-translate-y-0.5`}
                    >
                        {loading ? "Iniciando sesión..." : "Continuar"} <FiArrowRight className="text-xl" />
                    </button>
                </form>
            </div>
        </div>
    );
}
