import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Roster } from "@/types/Roster";
import { Player } from "@/types/Player";
import { PlayerPositionEnum } from "@/enums/PlayerPositionEnum";
import { Stat } from "@/types/Stat";
import { PlayerDetails } from "@/types/PlayerDetails";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const teamUrl = searchParams.get("teamUrl");

  const url = `https://foxsports.com${teamUrl}-roster`;
  try {
    const response = await axios.get(url);
    const rosterHTML = await response.data;

    const $ = cheerio.load(rosterHTML);

    //Create a new Roster
    const roster: Roster = { playerCount: 0, players: [] };

    // Find all roster tables (skip summary tables like PLAYER COUNT)
    $("table[id^='roster-table-']").each((_, tableElem) => {
      const table = $(tableElem);
      const headerCells = table.find("thead tr th");
      // Only process tables with a position group in the first header cell
      const position = headerCells.eq(0).text().trim();
      if (!position || position.toUpperCase().includes("PLAYER COUNT")) return;

      // Get stat names dynamically from header cells (skip first, which is usually "Player")
      const statNames: string[] = [];
      headerCells.each((i, th) => {
        if (i === 0) return; // skip player column
        statNames.push($(th).text().trim());
      });

      table.find("tbody tr").each((_, row) => {
        const $row = $(row);
        const cells = $row.find("td");

        // Player number (usually in a span or div in the first cell)
        const number = parseInt(cells.eq(0).find(".table-superscript").text().replace("#", "").trim(), 10) || undefined;

        // Name and image
        const entityDiv = cells.eq(0).find(".table-entity");
        const name = entityDiv.find(".table-entity-name h3").text().trim();
        const image = entityDiv.find("img").attr("src") || "";
        const webUrl = entityDiv.find(".table-entity-name").attr("href")
          ? `${entityDiv
              .find(".table-entity-name")
              .attr("href")}`
          : "";
          
        // Stats
        const stats: Stat[] = [];
        for (let i = 1; i < cells.length; i++) {
          const abbr = statNames[i - 1] || "";
          const value = cells.eq(i).find(".table-result").text().trim();
          stats.push({
            name: abbr,
            abbr,
            value,
          });
        }

        const player: Player = {
          name,
          image,
          webUrl,
          stats,
          details: {
            position,
            number,
          } as PlayerDetails,
        };

        roster.players.push(player);
      });
    });

    roster.playerCount = roster.players.length;

    return NextResponse.json(roster);
  } catch (error) {
    console.error("Failed to fetch roster", error);
    return NextResponse.json({ message: "Failed to fetch roster" });
  }
}
