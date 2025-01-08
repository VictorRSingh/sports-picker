// app/sportsPicker/bettingpros/nba/props/[player]/[prop]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest ) {
  const { searchParams } = new URL(request.url);
  const player = searchParams.get("player");
  const prop = searchParams.get("prop");

  return NextResponse.json({
    message: `Hello ${player}, your prop is ${prop}`,
  });
}
