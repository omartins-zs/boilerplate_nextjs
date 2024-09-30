'use client'

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"

export default function AdminPage() {
    const { data: session } = useSession();

    if (!session) {
        return <h1>Acesso Negado. Faça login para continuar.</h1>; // Mensagem para usuários não autenticados
    }

    return (
        <div>
            <h1>Bem-vindo, {session.user?.name}!</h1>
            <LogoutButton /> {/* Botão de logout */}
        </div>
    );
}
