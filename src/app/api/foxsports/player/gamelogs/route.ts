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

  const gameLog: GameLog = {
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
}
