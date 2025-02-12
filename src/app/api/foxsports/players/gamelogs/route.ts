import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Gamelog } from "@/types/Gamelog";
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const playerUrl = searchParams.get("playerUrl");

  const url = `https://www.foxsports.com${playerUrl}-game-log?season=2024`;

  console.log(url);

  try {
    const response = await axios.get(url);
    const gameLogsHTML = await response.data;

    const $ = cheerio.load(gameLogsHTML);

    // const gameLogs: Gamelog[] = [];

    

    const gameLog: Gamelog = {
        headers:
          {
            columns: $(".data-table thead th")
              .map((index, element) => ({
                index: index,
                text: $(element).text().trim(),
              }))
              .get(), // Convert the jQuery object to a standard array
          },
        rows: $(".data-table tbody tr")
          .map((_, rowElement) => ({
            columns: $(rowElement)
              .find("td")
              .map((index, columnElement) => {
                // Combine index 0 and 1 into one
                if (index === 0) {
                  return {
                    index: 0,
                    text: `${$(columnElement).text().trim()} ${$(
                      $(rowElement).find("td").get(1)
                    ).text().replace("@", "").trim()}`, // Combine index 0 and 1
                  };
                } else if (index > 1) {
                  // Adjust indices for remaining columns
                  return {
                    index: index - 1,
                    text: $(columnElement).text().trim(),
                  };
                }
                return null; // Skip index 1
              })
              .get()
              .filter(Boolean), // Remove null values
          }))
          .get(),
      };

    return NextResponse.json(gameLog);
  } catch (error) {
    console.error("Failed to fetch Gamelogs");
    return NextResponse.json({ message: "Failed to fetch Gamelogs" });
  }
}
