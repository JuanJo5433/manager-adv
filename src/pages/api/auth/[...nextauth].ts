import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePassword } from '@/utils/bcrypt'; // Asegúrate de que esta ruta sea correcta
import prisma from '@/lib/prisma';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }

  interface JWT {
    id: string;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
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

          if (!credentials?.identifier || !credentials?.password) {
            throw new Error('Email/Usuario y contraseña son requeridos');
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

          if (!user || !user.password) {
            throw new Error('Credenciales inválidas');
          }

          const isValid = await comparePassword(credentials.password, user.password);

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
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email ?? '';
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // Actualizar diario
  },
  pages: {
    signIn: '/', // Personalizar la página de login
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
