import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API está funcionando!" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: "POST funcionando!",
    data: body,
  });
}
