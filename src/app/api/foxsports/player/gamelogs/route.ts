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
  // Extract and transform the "GAME" field
  const [opposition, winLose] = data.GAME.replace("@", "").split("\n").map((item: any) =>
    item.trim()
  );

  // Helper to parse "made/taken" format
  const parseMadeTaken = (
    value: string
  ): { made: number; taken: number } | undefined => {
    if (!value || value === "-") return undefined;
    const [made, taken] = value.split("/").map(Number);
    return { made, taken };
  };

  return {
    opposition,
    winLose,
    minutesPlayed: data.MIN || undefined,
    points: data.PTS || undefined,
    fieldGoals: parseMadeTaken(data.FG),
    threePointFieldGoals: parseMadeTaken(data["3FG"]),
    freeThrows: parseMadeTaken(data.FT),
    offensiveRebounds: data["OFF REB"] || undefined,
    defensiveRebounds: data["DEF REB"] || undefined,
    rebounds: data.REB || undefined,
    assists: data.AST || undefined,
    steals: data.STL || undefined,
    blocks: data.BLK || undefined,
    personalFouls: data.PF || undefined,
    turnovers: data.TO || undefined,
    plusMinus: data["+/-"] || undefined,
    completions: data["COMP"] || undefined,
    passingAttempts: data["PATT"] || undefined,
    completionPercent: data["PCT"] || undefined,
    passingYards: data["PYDS"] || undefined,
    passingYardsPerAttemptAverage: data["PAVG"] || undefined,
    passingTouchdowns: data["PTD"] || undefined,
    interceptions: data["INT"] || undefined,
    sacks: data["SCK"] || undefined,
    sackYards: data["SCKYDS"] || undefined,
    rushingAttempts: data["RATT"] || undefined,
    rushingYards: data["RYDS"] || undefined,
    rushingYardsPerAttemptAverage: data["RAVG"] || undefined,
    rushingTouchdowns: data["RTD"] || undefined,
    fumbles: data["FUM"] || undefined,
    targets: data["TGT"] || undefined,
    receptions: data["REC"],
    receivingYards: data["RECYDS"],
    receivingTouchdowns: data["RECTD"],
  };
}
