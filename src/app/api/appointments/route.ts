import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.clinic?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.clinicId, session.user.clinic.id));

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.clinic?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, patientId, doctorId, appointmentPriceInCents } = body;

    const appointment = await db
      .insert(appointmentsTable)
      .values({
        date: new Date(date),
        patientId,
        doctorId,
        appointmentPriceInCents,
        clinicId: session.user.clinic.id,
      })
      .returning();

    return NextResponse.json(appointment[0]);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 