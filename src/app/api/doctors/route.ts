import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.clinic?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctors = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id));

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
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
    const {
      name,
      specialty,
      appointmentPriceInCents,
      availableFromWeekDay,
      availableToWeekDay,
      availableFromTime,
      availableToTime,
      avatarImageUrl,
    } = body;

    const doctor = await db
      .insert(doctorsTable)
      .values({
        name,
        specialty,
        appointmentPriceInCents,
        availableFromWeekDay,
        availableToWeekDay,
        availableFromTime,
        availableToTime,
        avatarImageUrl,
        clinicId: session.user.clinic.id,
      })
      .returning();

    return NextResponse.json(doctor[0]);
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 