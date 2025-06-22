import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(
      token,
      process.env.NEXTAUTH_SECRET || "fallback-secret",
    ) as {
      userId: string;
      email: string;
    };

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, decoded.userId),
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
