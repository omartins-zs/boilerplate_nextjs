'use server';

import * as bcrypt from 'bcrypt-ts'
import { prisma } from "@/lib/prisma";

interface RegisterUserParams {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterUserParams) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Usuário já existe", status: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Retorna o usuário criado
    return { message: "Usuário cadastrado com sucesso!", user, status: 201 };
  } catch (error) {
    console.error("Erro ao registrar usuário", error);
    return { error: "Erro ao registrar usuário", status: 500 };
  }
}
