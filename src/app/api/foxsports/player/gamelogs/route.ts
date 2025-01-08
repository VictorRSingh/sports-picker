import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { GameLog } from "@/interfaces/GameLog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const webUrl = searchParams.get("webUrl");
  const searchURL = `https://www.foxsports.com/${webUrl}-game-log?season=2024`;

  // TODO:
  // Get HTML data of GameLogs and parse into GameLog Objects to use.

  const response = await axios.get(searchURL);
  const data = await response.data;

  const $ = cheerio.load(data);

  const headers = $(".data-table thead th");
  const $rows = $(".data-table tbody tr");

  const processedRows: Record<string, string | number>[] = [];

  $rows.each((_, row) => {
    const cells = $(row).find("td");
    const rowObject: Record<string, string | number> = {};

    // Combine cells 0 and 1
    const combinedKey = `${$(cells[0]).text().trim()} ${$(
      cells[1]
    )
      .text()
      .trim()}`;

    rowObject["GAME"] = combinedKey;
    // Iterate through each cell and add it to the rowObject
    cells.each((cellIndex, cell) => {
      const headerText = $(headers[cellIndex - 1])
        .text()
        .trim(); // Get the corresponding header
      const cellText = $(cell).text().trim(); // Get the cell text

      // Only add to rowObject if headerText is not an empty string
      if (headerText) {
        rowObject[headerText] = isNaN(Number(cellText))
          ? cellText
          : Number(cellText); // Store as number if numeric
      }
    });

    // Push the row object to the processedRows array
    processedRows.push(rowObject);
  });

  let playerGameLogs: GameLog[] = [];

  for (let row of processedRows) {
    playerGameLogs.push(parseGameLog(row));
  }

  return NextResponse.json(playerGameLogs);
}

function parseGameLog(data: Record<string, any>): GameLog {
  // Helper to parse numeric values, treating "-" as 0
  const parseNumeric = (value: any): number => (value === "-" || !value ? 0 : Number(value));

  // Helper to parse "made/taken" format
  const parseMadeTaken = (
    value: string
  ): { made: number; taken: number } | undefined => {
    if (!value || value === "-") return undefined;
    const [made, taken] = value.split("/").map(Number);
    return { made, taken };
  };

  // Extract and transform the "GAME" field
  const [opposition, winLose] = data.GAME.replace("@", "").split("\n").map((item: any) =>
    item.trim()
  );

  return {
    opposition,
    winLose,
    minutesPlayed: parseNumeric(data.MIN),
    points: parseNumeric(data.PTS),
    fieldGoals: parseMadeTaken(data.FG),
    threePointFieldGoals: parseMadeTaken(data["3FG"]),
    freeThrows: parseMadeTaken(data.FT),
    offensiveRebounds: parseNumeric(data["OFF REB"]),
    defensiveRebounds: parseNumeric(data["DEF REB"]),
    rebounds: parseNumeric(data.REB),
    assists: parseNumeric(data.AST),
    steals: parseNumeric(data.STL),
    blocks: parseNumeric(data.BLK),
    personalFouls: parseNumeric(data.PF),
    turnovers: parseNumeric(data.TO),
    plusMinus: parseNumeric(data["+/-"]),
    completions: parseNumeric(data["COMP"]),
    passingAttempts: parseNumeric(data["PATT"]),
    completionPercent: parseNumeric(data["PCT"]),
    passingYards: parseNumeric(data["PYDS"]),
    passingYardsPerAttemptAverage: parseNumeric(data["PAVG"]),
    passingTouchdowns: parseNumeric(data["PTD"]),
    interceptions: parseNumeric(data["INT"]),
    sacks: parseNumeric(data["SCK"]),
    sackYards: parseNumeric(data["SCKYDS"]),
    rushingAttempts: parseNumeric(data["RATT"]),
    rushingYards: parseNumeric(data["RYDS"]),
    rushingYardsPerAttemptAverage: parseNumeric(data["RAVG"]),
    rushingTouchdowns: parseNumeric(data["RTD"]),
    fumbles: parseNumeric(data["FUM"]),
    targets: parseNumeric(data["TGT"]),
    receptions: parseNumeric(data["REC"]),
    receivingYards: parseNumeric(data["RECYDS"]),
    receivingTouchdowns: parseNumeric(data["RECTD"]),
  };
}
