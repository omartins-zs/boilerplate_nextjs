'use client'

import { useSession } from "next-auth/react"

export default function AdminPage() {
  const { data: session, status } = useSession(); // Obtém a sessão

  if (status === "loading") {
    return <h1>Loading...</h1>; // Exibe uma mensagem enquanto a sessão está sendo carregada
  }

  if (!session) {
    return <h1>Acesso negado. Faça login para continuar.</h1>; // Mensagem caso não esteja logado
  }

  return <h1>Bem-vindo,  {session.user?.name}!</h1>;
}
