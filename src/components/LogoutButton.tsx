"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutButton() {
    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <Button
            className="bg-slate-900 text-yellow-600"
            variant="outline"
            onClick={handleLogout}
        >
            Sair
        </Button>
    );
}
