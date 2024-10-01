import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
                if (credentials.email === "gabriel@email.com" && credentials.password === "123") {
                    return {
                        id: "1",
                        name: "Gabriel Matheus",
                        email: "gabriel@email.com",
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
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
