'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginForm() {
  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Choose your preferred login method
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@example.com" required type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Botões para login com provedores */}
        <div className="grid grid-cols-3 gap-2">
          <Button className="bg-blue-500 text-white hover:bg-blue-500" variant="outline" onClick={() => signIn("google")}>
            <FaGoogle />
          </Button>
          <Button className="bg-blue-400 text-white hover:bg-blue-700" variant="outline" onClick={() => signIn("discord")}>
            <FaDiscord />
          </Button>
          <Button className="bg-gray-900 text-white hover:bg-gray-800" variant="outline" onClick={() => signIn("github")}>
            <FaGithub />
          </Button>
        </div>
      </div>

      <div className="text-center text-sm">
        <a className="underline" href="#">
          Forgot password?
        </a>
      </div>
    </div>
  );
}
