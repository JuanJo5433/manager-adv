import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePassword } from '@/utils/bcrypt'; // Asegúrate de que esta ruta sea correcta
import prisma from '@/lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email o Usuario', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log("Credenciales recibidas:", credentials);
      
          if (!credentials.identifier || !credentials.password) {
            throw new Error('Email/Usuario y contraseña son requeridos');
          }
      
          // Verifica que prisma esté definido
          if (!prisma) {
            console.error("Prisma no está configurado");
            throw new Error('Error de configuración del servidor');
          }
      
          // Verifica la consulta a la base de datos
          const user = await prisma.users.findFirst({
            where: {
              OR: [
                { email: credentials.identifier.trim() },
                { username: credentials.identifier.trim() }
              ]
            }
          });
      
          console.log("Usuario encontrado:", user);
      
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
      
          console.log('Contraseña almacenada (hash):', user.password);
          const isValid = await comparePassword(credentials.password, user.password);
          console.log('Resultado de la comparación de contraseñas:', isValid);
      
          if (!isValid) {
            throw new Error('Contraseña incorrecta');
          }
      
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || null
          };
      
        } catch (error) {
          console.error("Error en authorize:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;  // Si deseas agregar el email al token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;  // Si agregaste el email al token
      return session;
    },
  },
  
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/', // Personalizar la página de login
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de que esta clave esté definida en tu archivo .env.local
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);