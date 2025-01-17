import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Roster } from "@/types/Roster";
import { Player } from "@/types/Player";
import { PlayerPositionEnum } from "@/enums/PlayerPositionEnum";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const teamUrl = searchParams.get("teamUrl");

  const url = `https://foxsports.com${teamUrl}-roster`;

  console.log(url);
  try {
    const response = await axios.get(url);
    const rosterHTML = await response.data;

    const $ = cheerio.load(rosterHTML);

    //Create a new Roster
    const roster: Roster = { playerCount: 0, players: [] };

    $(".table-roster .data-table tbody")
      .find("tr")
      .each((_, row) => {
        const cells = $(row)
          .find("td")
          .map((_, cell) => $(cell).text().trim())
          .get();

        // Extract the <img> tag's src attribute
        const imgTag = $(row).find("a.cell-logo img"); // Find the <img> tag inside the anchor with class 'cell-logo'
        const imgSrc = imgTag.attr("src"); // Get the 'src' attribute

        // Extract the <a> tag's 'href' attribute
        const linkTag = $(row).find("a.cell-logo");
        const playerHref = linkTag.attr("href"); // Link URL

        // Ignore data-table with player count, ensure imgSrc, playerHref are strings
        if (cells[1] !== "-" && imgSrc && playerHref) {
          const positionShort = cells[1];
          const positionFull =
            PlayerPositionEnum[
              positionShort as keyof typeof PlayerPositionEnum
            ];

          const player: Player = {
            name: cells[0].split("#")[0],
            number: Number(cells[0].split("#")[1]),
            position: positionFull,
            image: imgSrc,
            webUrl:playerHref
          };

          roster.players.push(player)
        }
      });

      roster.playerCount = roster.players.length;

    return NextResponse.json({ roster: roster});
  } catch (error) {
    console.error("Failed to fetch roster", error);
    return NextResponse.json({ message: "Failed to fetch roster" });
  }
}
