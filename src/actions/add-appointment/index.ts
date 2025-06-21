import { z } from "zod";

import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";

const addAppointmentSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  patientId: z.string().min(1, "Paciente é obrigatório"),
  doctorId: z.string().min(1, "Médico é obrigatório"),
  appointmentPriceInCents: z.number().min(1, "Preço deve ser maior que 0"),
});

export const addAppointment = protectedWithClinicActionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const appointment = await db
        .insert(appointmentsTable)
        .values({
          date: new Date(parsedInput.date),
          patientId: parsedInput.patientId,
          doctorId: parsedInput.doctorId,
          appointmentPriceInCents: parsedInput.appointmentPriceInCents,
          clinicId: ctx.user.clinic.id,
        })
        .returning();

      return { success: true, appointment: appointment[0] };
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      return { success: false, error: "Erro ao criar agendamento" };
    }
  }); 