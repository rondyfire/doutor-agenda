import { db } from "@/db";
import { patients, doctors, appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getDashboardData(clinicId: string) {
  const [patientsCount, doctorsCount, appointmentsCount] = await Promise.all([
    db.select().from(patients).where(eq(patients.clinicId, clinicId)),
    db.select().from(doctors).where(eq(doctors.clinicId, clinicId)),
    db.select().from(appointments).where(eq(appointments.clinicId, clinicId)),
  ]);

  // Mock data for dashboard components
  const dailyAppointmentsData = [
    { date: "2024-01-01", appointments: 5, revenue: 50000 },
    { date: "2024-01-02", appointments: 8, revenue: 80000 },
    { date: "2024-01-03", appointments: 12, revenue: 120000 },
    { date: "2024-01-04", appointments: 6, revenue: 60000 },
    { date: "2024-01-05", appointments: 9, revenue: 90000 },
    { date: "2024-01-06", appointments: 3, revenue: 30000 },
    { date: "2024-01-07", appointments: 7, revenue: 70000 },
  ];

  const topDoctors = [
    {
      id: "1",
      name: "Dr. João Silva",
      appointments: 25,
      specialty: "Cardiologia",
      avatarImageUrl: null,
    },
    {
      id: "2",
      name: "Dra. Maria Santos",
      appointments: 20,
      specialty: "Dermatologia",
      avatarImageUrl: null,
    },
    {
      id: "3",
      name: "Dr. Pedro Costa",
      appointments: 18,
      specialty: "Ortopedia",
      avatarImageUrl: null,
    },
  ];

  const topSpecialties = [
    { specialty: "Cardiologia", appointments: 45 },
    { specialty: "Dermatologia", appointments: 38 },
    { specialty: "Ortopedia", appointments: 32 },
  ];

  const todayAppointments = [
    {
      id: "1",
      patientName: "João Silva",
      doctorName: "Dr. Carlos",
      time: "09:00",
      status: "confirmed",
    },
    {
      id: "2",
      patientName: "Maria Santos",
      doctorName: "Dra. Ana",
      time: "10:30",
      status: "confirmed",
    },
  ];

  return {
    patientsCount: patientsCount.length,
    doctorsCount: doctorsCount.length,
    appointmentsCount: appointmentsCount.length,
    dailyAppointmentsData,
    topDoctors,
    topSpecialties,
    todayAppointments,
    totalRevenue: { total: 0 },
    totalAppointments: { total: appointmentsCount.length },
    totalPatients: { total: patientsCount.length },
    totalDoctors: { total: doctorsCount.length },
  };
}
