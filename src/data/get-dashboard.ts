import { db } from "@/db";
import { appointments, patients, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getDashboard(userId: string) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Buscar estatísticas gerais
  const [stats] = await db
    .select({
      totalPatients: sql<number>`count(distinct ${patients.id})`,
      totalAppointments: sql<number>`count(distinct ${appointments.id})`,
      todayAppointments: sql<number>`count(distinct case when ${appointments.date} >= ${startOfDay} and ${appointments.date} < ${endOfDay} then ${appointments.id} end)`,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.userId, userId));

  // Buscar próximos compromissos
  const upcomingAppointments = await db
    .select({
      id: appointments.id,
      date: appointments.date,
      status: appointments.status,
      patient: {
        id: patients.id,
        name: patients.name,
      },
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(
      sql`${appointments.date} >= ${startOfDay} and ${appointments.userId} = ${userId}`
    )
    .orderBy(desc(appointments.date))
    .limit(5);

  // Buscar pacientes recentes
  const recentPatients = await db
    .select({
      id: patients.id,
      name: patients.name,
      email: patients.email,
      phone: patients.phone,
      createdAt: patients.createdAt,
    })
    .from(patients)
    .where(eq(patients.userId, userId))
    .orderBy(desc(patients.createdAt))
    .limit(5);

  return {
    stats,
    upcomingAppointments,
    recentPatients,
  };
} 