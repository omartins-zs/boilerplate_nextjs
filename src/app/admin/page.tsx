"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminPage() {
    const { data: session, status } = useSession();
    console.log("Sessão:", session);

    useEffect(() => {
        if (!session) {
            const timer = setTimeout(() => {
                window.location.href = "/login"; // Redireciona após 3 segundos se não houver sessão
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [session]);

    if (status === "loading") {
        return <p>Carregando</p>
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Acesso Negado!</strong>
                    <span className="block sm:inline"> Faça login para continuar.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Bem-vindo, {session?.user?.name}!</h1>
            <LogoutButton />
        </div>
    );
}
