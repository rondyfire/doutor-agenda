import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    console.log("Auth test route called");
    console.log("Auth config:", auth);
    return NextResponse.json({
      message: "Auth is working",
      config: "Auth object exists",
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({ error: "Auth test failed" }, { status: 500 });
  }
}
