import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";
import * as bcrypt from 'bcrypt-ts'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    debug: true,
    providers: [
        Google,
        GitHub,
        Discord,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || typeof credentials.email !== 'string' ||
                        !credentials?.password || typeof credentials.password !== 'string') {
                        console.log("Credenciais inválidas");
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.password) {
                        console.log("Usuário não encontrado");
                        return null;
                    }
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log("Senha inválida");
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.error("Erro ao autorizar:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async redirect({ baseUrl }) {
            return baseUrl + "/admin";
        },
        async jwt({ token }) {
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
});
