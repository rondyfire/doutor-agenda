import { z } from "zod";

import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const upsertDoctorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  appointmentPriceInCents: z.number().min(1, "Preço deve ser maior que 0"),
  availableFromWeekDay: z.number().min(0).max(6),
  availableToWeekDay: z.number().min(0).max(6),
  availableFromTime: z.string(),
  availableToTime: z.string(),
  avatarImageUrl: z.string().optional(),
});

export const upsertDoctor = protectedWithClinicActionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      if (parsedInput.id) {
        // Update existing doctor
        const updatedDoctor = await db
          .update(doctorsTable)
          .set({
            name: parsedInput.name,
            specialty: parsedInput.specialty,
            appointmentPriceInCents: parsedInput.appointmentPriceInCents,
            availableFromWeekDay: parsedInput.availableFromWeekDay,
            availableToWeekDay: parsedInput.availableToWeekDay,
            availableFromTime: parsedInput.availableFromTime,
            availableToTime: parsedInput.availableToTime,
            avatarImageUrl: parsedInput.avatarImageUrl,
          })
          .where(eq(doctorsTable.id, parsedInput.id))
          .returning();

        return { success: true, doctor: updatedDoctor[0] };
      } else {
        // Create new doctor
        const newDoctor = await db
          .insert(doctorsTable)
          .values({
            name: parsedInput.name,
            specialty: parsedInput.specialty,
            appointmentPriceInCents: parsedInput.appointmentPriceInCents,
            availableFromWeekDay: parsedInput.availableFromWeekDay,
            availableToWeekDay: parsedInput.availableToWeekDay,
            availableFromTime: parsedInput.availableFromTime,
            availableToTime: parsedInput.availableToTime,
            avatarImageUrl: parsedInput.avatarImageUrl,
            clinicId: ctx.user.clinic.id,
          })
          .returning();

        return { success: true, doctor: newDoctor[0] };
      }
    } catch (error) {
      console.error("Erro ao upsert médico:", error);
      return { success: false, error: "Erro ao salvar médico" };
    }
  }); 