// https://api.foxsports.com/bifrost/v1/nba/league/schedule-segment/2025-01-09?apikey=jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq

import { Matchup, Team } from "@/interfaces/Matchup";
import { match } from "assert";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport");
  const date = searchParams.get("date");
  const [year, month, day] = date!.split("-");
  const searchUrl = `https://api.foxsports.com/bifrost/v1/${sport}/league/schedule-segment/${
    Number(year) - 1
  }-${year}${month}${day}?apikey=jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq`;


  try {
    const response = await axios.get(searchUrl);
    const data = await response.data;

    const matchups = createMatchupsFromFirstTable(data, date!);
    return NextResponse.json(matchups);
    
  } catch (error) {
    console.error("Error fetching schedule", error);
  }
}

const createMatchupsFromFirstTable = (
  data: any,
  formattedDate: string
): Matchup[] => {
  const tables = data.tables;
  if (!tables || !Array.isArray(tables)) {
    throw new Error("Invalid data structure: No tables array found");
  }

  // Get the first table
  const firstTable = tables[0];
  if (!firstTable || !firstTable.rows || firstTable.rows.length === 0) {
    return []; // No rows in the first table
  }

  // Extract matchups from all rows in the first table
  const date = formattedDate || "";
  const matchups: Matchup[] = firstTable.rows.map((row: any) => {
    const matchLink = row.entityLink?.webUrl || "";
    const matchId = row.entityLink?.layout?.tokens?.id || "";

    const teams: Team[] = [
      {
        logo: row.columns[0]?.imageUrl || "",
        name: row.linkList[0]?.entityLink?.imageAltText || "",
        shortName: row.columns[0]?.text || "",
        webUrl: row.linkList[0]?.entityLink?.webUrl || "",
      },
      {
        logo: row.columns[2]?.imageUrl || "",
        name: row.linkList[1]?.entityLink?.imageAltText || "",
        shortName: row.columns[2]?.text || "",
        webUrl: row.linkList[1]?.entityLink?.webUrl || "",
      },
    ];

    return { date, matchLink, matchId, teams };
  });

  return matchups;
};