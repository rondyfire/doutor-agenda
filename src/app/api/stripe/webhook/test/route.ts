import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  });
};

export const POST = async (request: Request) => {
  const body = await request.text();
  console.log("Test webhook received:", body);

  return NextResponse.json({
    message: "Test webhook received",
    body: body,
    timestamp: new Date().toISOString(),
  });
};
