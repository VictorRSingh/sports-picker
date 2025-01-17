import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Game } from "@/types/Game";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");

  const url = `https://www.foxsports.com/odds/${sport}/games`;

  try {
    const response = await axios.get(url);
    const gamesHTML = await response.data;

    const $ = cheerio.load(gamesHTML);

    const games: Game[] = [];

    // $(".right-column").each((_, game) => {
    // const rows: string[][] = [];
    //   let gameUrl;
    //   // Collect all rows in a game
    //   $(game)
    //     .find("a .odds-sp-content .sp-rows")
    //     .each((_, row) => {
    //       const cells = $(row)
    //         .find("div")
    //         .map((index, cell) => $(cell).text().trim())
    //         .get();

    //       // Filter only the desired indices (1, 3, 4, 5)
    //       const filteredCells = cells.filter((_, index) =>
    //         [2, 3, 4, 5, 6].includes(index)
    //       );
    //       rows.push(filteredCells); // Push filtered data into rows array
    //     });

    // // Group rows into games (home and away)
    // for (let i = 0; i < rows.length; i += 2) {
    //   const awayRow = rows[i];
    //   const homeRow = rows[i + 1];

    //   if (homeRow && awayRow && gameUrl) {
    //       const game: Game = {
    //         gameUrl: gameUrl,
    //           away: {
    //               team: awayRow[0],
    //               short: awayRow[1],
    //               spread: awayRow[2],
    //               moneyline: awayRow[3],
    //               total: awayRow[4]
    //           },
    //           home: {
    //             team: homeRow[0],
    //             short: homeRow[1],
    //             spread: homeRow[2],
    //             moneyline: homeRow[3],
    //             total: homeRow[4]
    //           }
    //       }
    //     games.push(game);
    //   }
    //   }
    // });

    $(".right-column")
      .find("a")
      .each((_, game) => {
        const rows: string[][] = [];
        const gameUrl = $(game).attr("href");
        $(game)
          .find(".odds-sp-content div")
          .eq(5)
          .find(".sp-rows")
          .each((_, row) => {
            const cells = $(row)
              .find("div")
              .map((index, cell) => $(cell).text().trim())
              .get();

            rows.push(cells);

            // Group rows into games (home and away)
            for (let i = 0; i < rows.length; i += 2) {
              const awayRow = rows[i];
              const homeRow = rows[i + 1];

              if (homeRow && awayRow && gameUrl) {
                const game: Game = {
                  gameUrl: gameUrl,
                  away: {
                    team: awayRow[0].split("\n          \n            ")[0],
                    short: awayRow[0].split("\n          \n            ")[1],
                    spread: awayRow[4],
                    moneyline: awayRow[5],
                    total: awayRow[6],
                  },
                  home: {
                    team: homeRow[0].split("\n          \n            ")[0],
                    short: homeRow[0].split("\n          \n            ")[1],
                    spread: homeRow[4],
                    moneyline: homeRow[5],
                    total: homeRow[6],
                  },
                };
                games.push(game);
              }
            }
          });
      });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Failed to fetch game odds", error);
    return NextResponse.json({ message: "Failed to fetch game odds" });
  }
}
