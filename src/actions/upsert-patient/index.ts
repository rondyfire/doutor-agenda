import { z } from "zod";

import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, "Telefone é obrigatório"),
  sex: z.enum(["male", "female"]),
});

export const upsertPatient = protectedWithClinicActionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      if (parsedInput.id) {
        // Update existing patient
        const updatedPatient = await db
          .update(patientsTable)
          .set({
            name: parsedInput.name,
            email: parsedInput.email,
            phoneNumber: parsedInput.phoneNumber,
            sex: parsedInput.sex,
          })
          .where(eq(patientsTable.id, parsedInput.id))
          .returning();

        return { success: true, patient: updatedPatient[0] };
      } else {
        // Create new patient
        const newPatient = await db
          .insert(patientsTable)
          .values({
            name: parsedInput.name,
            email: parsedInput.email,
            phoneNumber: parsedInput.phoneNumber,
            sex: parsedInput.sex,
            clinicId: ctx.user.clinic.id,
          })
          .returning();

        return { success: true, patient: newPatient[0] };
      }
    } catch (error) {
      console.error("Erro ao upsert paciente:", error);
      return { success: false, error: "Erro ao salvar paciente" };
    }
  }); 