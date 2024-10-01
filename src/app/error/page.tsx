'use client'

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container">
      <h1>Erro de Autenticação</h1>
      {error && <p>{error}</p>}
      <p>Ocorreu um erro durante o processo de login. Por favor, tente novamente.</p>
      <a href="/login">Voltar para o login</a>
    </div>
  );
}
