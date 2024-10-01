import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
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
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                })
                console.log("Usuario ", user)
                if (user) {
                    return user;
                }
                return null;
                // if (credentials.email === "gabriel@email.com" && credentials.password === "123") {
                //     return {
                //         id: "1",
                //         name: "Gabriel Matheus",
                //         email: "gabriel@email.com",
                //     };
                // }
                // return null;
            },
        }),
    ],
    callbacks: {
        async redirect({ baseUrl }) {
            return baseUrl + "/admin";
        },
        async jwt({ token }) {
            return token
        },
        async session({ session }) {
            return session;
        },
    },
});
