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

    const gamePromises = $(".right-column")
    .find("a")
    .map(async (_, game) => { // ✅ Use `.map()` to return promises
      const rows: string[][] = [];
      const gameUrl = $(game).attr("href");
  
      if (!gameUrl) return null; // Skip if gameUrl is undefined
  
      const teamUrls = await fetchTeamUrls(gameUrl); // ✅ Await the Promise properly
  
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
        });
  
      const gamesArray: Game[] = [];
  
      for (let i = 0; i < rows.length; i += 2) {
        const awayRow = rows[i];
        const homeRow = rows[i + 1];
  
        if (homeRow && awayRow) {
          gamesArray.push({
            gameUrl: gameUrl,
            away: {
              team: awayRow[0].split("\n          \n            ")[0],
              short: awayRow[0].split("\n          \n            ")[1],
              spread: awayRow[4],
              moneyline: awayRow[5],
              total: awayRow[6],
              teamUrl: teamUrls[0], // ✅ No Promise issues
            },
            home: {
              team: homeRow[0].split("\n          \n            ")[0],
              short: homeRow[0].split("\n          \n            ")[1],
              spread: homeRow[4],
              moneyline: homeRow[5],
              total: homeRow[6],
              teamUrl: teamUrls[1], // ✅ No Promise issues
            },
          });
        }
      }
  
      return gamesArray;
    })
    .get(); // ✅ `.get()` converts the mapped results into an array
  
  // ✅ Wait for all async operations to complete
  const games = (await Promise.all(gamePromises)).flat().filter(Boolean);
  
  return NextResponse.json(games);
  
  } catch (error) {
    console.error("Failed to fetch game odds", error);
    return NextResponse.json({ message: "Failed to fetch game odds" });
  }
}

const fetchTeamUrls = async (gameUrl: string) => {
  const response = await axios.get(`https://foxsports.com${gameUrl}`);
  const teamsHTML = await response.data;

  const $ = cheerio.load(teamsHTML);

  const awayTeamLink = $('.team-logo-1').attr('href') || 'Not Found';
  const homeTeamLink = $('.team-logo-2').attr('href') || 'Not Found';

  return [awayTeamLink, homeTeamLink];

}
