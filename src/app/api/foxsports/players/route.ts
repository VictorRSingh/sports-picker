import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { Player } from "@/types/Player";
import { PlayerPositionEnum } from "@/enums/PlayerPositionEnum";
import { Stat } from "@/types/Stat";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const playerUrl = searchParams.get("playerUrl");

    if (!playerUrl) {
      return;
    }

    const response = await axios.get(`https://foxsports.com${playerUrl}-stats`);
    const playerHtML = await response.data;

    const $ = cheerio.load(playerHtML);

    const playerHeader = $(".entity-container .entity-header");
    const playerImage = $(playerHeader)
      .find(".entity-logo-fav")
      .find("img")
      .attr("src");
    const playerName = $(playerHeader)
      .find(".entity-title")
      .find(".title")
      .find("span")
      .eq(0)
      .text()
      .trim();

    const player: Player = {
      name: playerName,
      image: playerImage as string,
      webUrl: playerUrl,
      stats: [],
    };

    const playerDetails = $(playerHeader)
      .find(".entity-title")
      .find(".title")
      .find("span")
      .eq(1)
      .text()
      .trim();
    const playerNumber = playerDetails.split(" - ")[0].replace("#", "");
    const playerPosition = playerDetails.split(" - ")[1];
    const playerTeam = playerDetails.split(" - ")[2];


    console.log(playerPosition.split(" ").map((word) => word[0]).join(""));

    player.details = {
      number: Number(playerNumber),
      position:
        PlayerPositionEnum[
          playerPosition
            .split(" ")
            .map((word) => word[0])
            .join("") as keyof typeof PlayerPositionEnum
        ],
      team: playerTeam,
    };


    $(".stats-overview-container")
      .find("a")
      .each((_, stat) => {
        const statHeader = $(stat).find("h3").text().trim();
        const statValue = $(stat)
          .find(".stat-data div")
          .first()
          .text()
          .trim();
        const statAbbr = $(stat).find(".stat-abbr").text().trim();
        const statRanking = $(stat).find(".stat-rankline").text().trim();

        const playerStat: Stat = {
          name: statHeader,
          abbr: statAbbr,
          value: statValue,
          ranking: statRanking,
        };

        player.stats?.push(playerStat);
      });

    return NextResponse.json(player! as Player);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}
