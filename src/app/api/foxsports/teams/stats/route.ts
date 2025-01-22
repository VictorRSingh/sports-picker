import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { TeamStats } from "@/types/TeamStats";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");

  const url = `https://www.foxsports.com/${sport}/team-stats?category=defense`;

  console.log(url);

  try {
    const response = await axios.get(url);
    const statsHTML = await response.data;

    const $ = cheerio.load(statsHTML);

    const teamStat: TeamStats = {
      headers: {
        columns: $(".data-table thead th").map((index, element) => ({
          index: index,
          text: $(element).text().trim(),
        }))
        .get()
      },
      rows: $(".data-table tbody tr")
      .map((_, rowElement) => ({
        columns: $(rowElement)
        .find("td")
        .map((index, columnElement) => {
          if (index === 0) {
            return { 
              index: 0,
              text: `${$(columnElement).text().trim()} ${$(
                $(rowElement).find("td").get(1)
              ).text().trim()}`
            };
          } else if (index > 1) {
            return {
              index: index - 1,
              text: $(columnElement).text().trim(),
            };
          }
          return null;
        })
        .get()
        .filter(Boolean)
      }))
      .get()
    };

    return NextResponse.json(teamStat);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}
