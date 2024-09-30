import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Prisma } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(Prisma),
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

                console.log("Credentials", credentials);

                // Verifica credenciais estáticas
                if (!credentials) {
                    return null;
                }

                if (credentials.email === "gabriel@email.com" && credentials.password === "123") {
                    return {
                        id: "1",
                        name: "Gabriel Matheus",
                        email: "gabriel@email.com",
                    };
                }

                // Se as credenciais não corresponderem, tenta verificar no banco de dados
                // let user = null;

                // // lógica para salgar e hashear a senha
                // const pwHash = saltAndHashPassword(credentials.password);

                // // lógica para verificar se o usuário existe
                // user = await getUserFromDb(credentials.email, pwHash);

                // if (!user) {
                //     // Nenhum usuário encontrado
                //     throw new Error("User not found.");
                // }

                // // Retorna o objeto do usuário com seus dados de perfil
                // return user;
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl + "/admin"; // Redireciona para a página admin após login
        },
    },
});