import { withAuth } from 'next-auth/middleware';

/**
 * Middleware de autenticación que protege rutas específicas.
 * Si el usuario no está autenticado, se redirige a la página de inicio de sesión.
 */
export default withAuth({
  pages: {
    signIn: '/signin', // Ruta a la página de inicio de sesión
  },
});

/**
 * Configuración del middleware.
 * Define las rutas que deben estar protegidas por autenticación.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',    // Protege el dashboard y todas sus subrutas
    '/admin/:path*',        // Protege el área de admin y todas sus subrutas
    '/api/protected/:path*' // Protege las rutas API bajo /api/protected y sus subrutas
  ],
};