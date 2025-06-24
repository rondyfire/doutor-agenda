import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    console.log("Manually updating user:", userId, "with plan: essential");

    await db
      .update(usersTable)
      .set({
        plan: "essential",
        stripeSubscriptionId: "test_subscription",
        stripeCustomerId: "test_customer",
      })
      .where(eq(usersTable.id, userId));

    console.log("User updated successfully");

    return NextResponse.json({
      success: true,
      message: "User plan updated to essential",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
};
