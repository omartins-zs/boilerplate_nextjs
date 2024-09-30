"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutButton() {
    return (
        <Button className="bg-slate-900" variant="outline" onClick={() => {signOut({ callbackUrl: "/" });}}>
            Sair
        </Button>
    );
}
