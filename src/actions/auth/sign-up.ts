"use server";

import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/db";
import { usersTable, accountsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { actionClient } from "@/lib/next-safe-action";

const signUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signUp = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { name, email, password } = parsedInput;

      // Verificar se o usuário já existe
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingUser) {
        return { error: "Usuário já existe com este email" };
      }

      // Hash da senha
      const hashedPassword = await hash(password, 12);

      // Criar usuário
      const [newUser] = await db
        .insert(usersTable)
        .values({
          id: `user_${Date.now()}`,
          name,
          email,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Criar conta do usuário (onde fica a senha)
      await db.insert(accountsTable).values({
        id: `account_${Date.now()}`,
        accountId: `account_${Date.now()}`,
        providerId: "credentials",
        userId: newUser.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: "Erro interno do servidor" };
    }
  });
