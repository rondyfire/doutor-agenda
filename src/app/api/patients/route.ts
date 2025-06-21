import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.clinic?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id));

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
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
    const { name, email, phoneNumber, sex } = body;

    const patient = await db
      .insert(patientsTable)
      .values({
        name,
        email,
        phoneNumber,
        sex,
        clinicId: session.user.clinic.id,
      })
      .returning();

    return NextResponse.json(patient[0]);
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 