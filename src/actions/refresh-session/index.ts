"use server";

import { revalidatePath } from "next/cache";

import { protectedActionClient } from "@/lib/next-safe-action";

export const refreshSession = protectedActionClient.action(async ({ ctx }) => {
  // Força o refresh da sessão
  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    success: true,
    userId: ctx.user.id,
    plan: ctx.user.plan,
  };
});
