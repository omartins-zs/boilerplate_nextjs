"use server";

import { InvitationStatus, UserAccess } from "@prisma/client";
import * as bcrypt from "bcrypt-ts";
import { addHours } from "date-fns";
import { AuthError } from "next-auth";

import { auth, signIn, signOut } from "@/auth";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";
import { sendErrorResponse, sendSuccessResponse } from "@/lib/utils";
import {
  ForgotPasswordSchema,
  RecoveryPasswordSchema,
  SignUpSchema,
  forgotPasswordSchema,
  recoveryPasswordSchema,
  signUpSchema,
} from "@/validators/auth";
import { WaitlistSchema } from "@/validators/waitlist";

import { sendEmail } from "./resend";

export const recoveryPassword = async (values: RecoveryPasswordSchema) => {
  const d = await recoveryPasswordSchema.safeParseAsync(values);

  try {
    if (!d.success)
      throw new Error("As senhas não são iguais. Confirme novamente!");

    const { password, token } = d.data;

    const recoveryPassword = await prisma.recoveryPassword.findFirst({
      where: {
        token,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!recoveryPassword)
      throw new Error("O usuário não possui um link de recuperação!");

    if (new Date() > new Date(recoveryPassword.expires)) {
      await prisma.recoveryPassword.deleteMany({
        where: {
          token,
        },
      });

      throw new Error("O link de recuperação já atingiu a data limite!");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: {
        email: recoveryPassword.email,
      },
      data: {
        password: hash,
      },
    });

    await prisma.recoveryPassword.deleteMany({
      where: {
        email: user.email,
      },
    });

    return sendSuccessResponse("Senha alterada com sucesso!");
  } catch (error: any) {
    return sendErrorResponse(error.message);
  }
};

export const forgotPassword = async (values: ForgotPasswordSchema) => {
  const d = await forgotPasswordSchema.safeParseAsync(values);

  try {
    if (!d.success) throw new Error("Email inválido");

    const { email } = d.data;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user)
      throw new Error("Não encontramos nenhum usuário com o email informado!");

    const recoveryPassword = await prisma.recoveryPassword.create({
      data: {
        email,
        expires: addHours(new Date(), 3),
      },
    });

    sendEmail(
      email,
      "Link de recuperação de senha",
      `Você foi convidado pra fazer parte da Yaduzz clique no link <a href="${env.NEXT_PUBLIC_BASE_URL + `/recovery-password/${recoveryPassword.token}`}">Clique aqui</a>`,
    );

    return sendSuccessResponse(
      "Enviamos um e-mail ao endereço de email informado!",
    );
  } catch (error: any) {
    return sendErrorResponse(error.message);
  }
};

export const signInInvitationUser = async (values: SignUpSchema) => {
  const d = await signUpSchema.safeParseAsync(values);

  try {
    if (!d.success) throw new Error("Email ou senha inválidos!");

    const { email, password, token } = d.data;

    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        email,
        status: InvitationStatus.PENDING,
      },
    });

    if (!invitation)
      throw new Error(
        "O convite já foi utilizado! Entre em contato com a empresa!",
      );

    const user = await prisma.user.findFirst({ where: { email } });

    if (user) throw new Error("O email já está em uso!");

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: email.split("@")[0],
        password: hash,
        email,
        userAccess: invitation.userAccess,
        jobId: invitation.jobId,
        companies: { connect: { id: invitation.companyId } },
      },
    });

    await prisma.invitation.update({
      data: { status: InvitationStatus.ACCEPTED },
      where: { id: invitation.id, token },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return sendSuccessResponse(
      "Usuário cadastrado com sucesso. Seja bem-vindo!",
    );
  } catch (error) {
    return sendErrorResponse("Ocorreu um erro ao cadastrar o usuário!");
  }
};

export const signInUser = async (values: SignUpSchema) => {
  const d = await signUpSchema.safeParseAsync(values);

  try {
    if (!d.success) throw new Error("Email ou senha inválidos!");

    const { email, password } = d.data;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.password) throw new Error("Email ou senha inválidos!");

    const compare = await bcrypt.compare(password, user.password!);

    if (!compare) throw new Error("Email ou senha inválidos!");

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return sendSuccessResponse("Usuário logado com sucesso!");
  } catch (error: any) {
    if (error instanceof AuthError) {
      if (error.type === 'AccessDenied') {
        return sendErrorResponse("O usuário está inativado! Entre em contato com o gestor da empresa!");
      }

      return sendErrorResponse("Email ou senha inválidos!");
    }

    return sendErrorResponse(error.message);
  }
};

export const signUpUser = async (values: SignUpSchema) => {
  const d = await signUpSchema.safeParseAsync(values);

  if (!d.success) throw new Error("Email ou senha inválidos!");

  const { email, password } = d.data;

  const user = await prisma.user.findFirst({ where: { email } });

  if (user) throw new Error("O email já está em uso!");

  const name = email.split("@")[0];
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      image: `https://api.multiavatar.com/${name}.png`,
      userAccess: UserAccess.OWNER,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    sendEmail(
      email,
      "Seja muito bem vindo(a) à Yaduzz",
      "Seja muito bem vindo(a) à Yaduzz",
    );

    return sendSuccessResponse("Usuário cadastrado com sucesso!");
  } catch (error: any) {
    return sendErrorResponse("Ocorreu um erro ao cadastrar o usuário!");
  }
};

export const logout = async () => {
  await signOut();
};

export const setEnableNotifications = async ({ sub }: any) => {
  const session = await auth();

  await prisma.push.create({
    data: {
      auth: sub.keys.auth,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      expirationTime: sub.expirationTime,
      user: { connect: { id: session?.user.id } },
    },
  });

  return { success: true };
};

export async function createWaitlist(values: WaitlistSchema) {
  const waitlist = await prisma.waitlist.create({
    data: values,
  });

  return waitlist;
}
