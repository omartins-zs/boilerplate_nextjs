import { useSession } from "next-auth/react";

export default function UserPage() {
  const session = useSession();
  console.log(session);
  return <h1>Bem-vindo,  {session.data?.user?.name}!</h1>;


}