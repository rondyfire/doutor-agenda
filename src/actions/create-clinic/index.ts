"use server";

import { z } from "zod";

import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clinicsTable } from "@/db/schema";

const createClinicSchema = z.object({
  name: z.string().min(1, "Nome da clínica é obrigatório"),
});

export const createClinic = protectedWithClinicActionClient
  .schema(createClinicSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const clinic = await db.insert(clinicsTable).values({
        name: parsedInput.name,
      }).returning();

      return { success: true, clinic: clinic[0] };
    } catch (error) {
      console.error("Erro ao criar clínica:", error);
      return { success: false, error: "Erro ao criar clínica" };
    }
  });