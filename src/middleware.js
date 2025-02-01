import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/signin',
  },
});

export const config = { 
  matcher: [
    '/dashboard/:path*',    // Protege el dashboard
    '/admin/:path*',        // Protege el área de admin
    '/api/protected/:path*' // Protege las rutas API bajo /api/protected
  ],
};
