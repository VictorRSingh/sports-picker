import { NextResponse, NextRequest } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { Game } from "@/types/Game";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const currentDate = `${yyyy}-${mm}-${dd}`;
  const url = `https://foxsports.com/${sport}/schedule?date=${currentDate}`;

  try {
    const response = await axios.get(url);
    const scheduleHTML = response.data;

    const $ = cheerio.load(scheduleHTML);
    const scheduleContainer = $("#table-0 tbody");

    if (!scheduleContainer.length) {
      return NextResponse.json({
        success: false,
        message: "No schedule found",
      });
    }

    const games: Game[] = [];

    scheduleContainer.find("tr").each((_, row) => {
      const $row = $(row);

      const awayTeamCell = $row.find("td").eq(0);
      const homeTeamCell = $row.find("td").eq(2);
      const statusCell = $row.find("td").eq(3);
      const venueCell = $row.find("td").eq(4);

      const awayTeam = awayTeamCell.find("img").attr("alt") || "";
      const awayAbbr = awayTeamCell.find(".table-entity-name").text().trim();
      const homeTeam = homeTeamCell.find("img").attr("alt") || "";
      const homeAbbr = homeTeamCell.find(".table-entity-name").text().trim();
      const webUrl = awayTeamCell.find("a").attr("href") || "";
      let rawStatus = statusCell.find(".table-result").text().trim();
      let [hoursStr, minutesPart] = rawStatus.split(":");
      let hours = parseInt(hoursStr);
      let minutes = parseInt(minutesPart);
      let isPM = minutesPart?.includes("PM");

      let date = new Date();
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      date.setHours(hours - 4); // Subtract 4 hours
      date.setMinutes(minutes);

      let localTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const [venue, venueCity, venueState] = venueCell.first().text().trim().split(',');

      games.push({
        id: `${sport}-${awayAbbr}-${homeAbbr}-${currentDate}`,
        date: $(".scores-scorechips-container")
          .find(".table-emphasized-title .table-title")
          .first()
          .text()
          .trim(),
        status: rawStatus.includes("PM") || rawStatus.includes("AM") ? localTime : rawStatus,
        teams: {
          awayTeam: {
            name: awayTeam,
            logo: awayTeamCell.find("img").attr("src") || "",
            webUrl: ""
          },
          homeTeam: {
            name: homeTeam,
            logo: homeTeamCell.find("img").attr("src") || "",
            webUrl: ""
          },
        },
        location: {
          city: `${venueCity ? venueCity.trim() : ""}, ${venueState ? venueState.trim() : ""}`,
          stadium: venue,
        },
        webUrl: `${webUrl}`,
      } as Game);
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch schedule",
    });
  }
}
