// app/sportsPicker/bettingpros/nba/props/[player]/[prop]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { player: string; prop: string } }) {
  const { player, prop } = params;

  return NextResponse.json({
    message: `Hello ${player}, your prop is ${prop}`,
  });
}
