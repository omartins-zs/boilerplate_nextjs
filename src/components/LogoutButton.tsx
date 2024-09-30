"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            className="btn btn-outline"
            onClick={() => {
                signOut({ callbackUrl: "/" }); // Redireciona para a página inicial após logout
            }}
        >
            Sair
        </button>
    );
}
