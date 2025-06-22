"use server";

import { z } from "zod";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { usersTable, accountsTable } from "@/db/schema";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { eq, and } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export async function login(formData: FormData) {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return { error: "Dados inválidos" };
    }

    const { email, password } = validatedFields.data;

    // Buscar usuário
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return { error: "Email ou senha inválidos" };
    }

    // Buscar conta do usuário (onde está a senha)
    const account = await db.query.accountsTable.findFirst({
      where: (accounts, { eq, and }) =>
        and(
          eq(accounts.userId, user.id),
          eq(accounts.providerId, "credentials"),
        ),
    });

    if (!account || !account.password) {
      return { error: "Email ou senha inválidos" };
    }

    // Verificar senha
    const isValidPassword = await compare(password, account.password);

    if (!isValidPassword) {
      return { error: "Email ou senha inválidos" };
    }

    // Criar token JWT
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    );

    // Definir cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Erro interno do servidor" };
  }
}
