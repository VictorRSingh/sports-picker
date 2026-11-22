import { NextResponse, NextRequest } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { Game } from "@/types/Game";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");

  // NFL schedules are grouped by official season week, not a single calendar day.
  if (sport === "nfl") {
    const year = Number(searchParams.get("year") ?? new Date().getFullYear());
    const week = Number(searchParams.get("week") ?? 1);
    const stage = Number(searchParams.get("stage") ?? 2); // 1 preseason, 2 regular, 3 postseason
    if (!Number.isInteger(year) || year < 2000 || year > 2100 || !Number.isInteger(week) || week < 1 || week > 18 || ![1,2,3].includes(stage)) {
      return NextResponse.json({ error: "Invalid NFL season/week" }, { status: 400 });
    }
    try {
      const endpoint = new URL("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
      endpoint.searchParams.set("dates", String(year));
      endpoint.searchParams.set("seasontype", String(stage));
      endpoint.searchParams.set("week", String(week));
      const response = await fetch(endpoint, { next: { revalidate: 300 }, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`NFL scoreboard returned ${response.status}`);
      const payload = await response.json();
      const games = (Array.isArray(payload.events) ? payload.events : []).map((event: any) => {
        const competition = event.competitions?.[0];
        const competitors = competition?.competitors ?? [];
        const away = competitors.find((team: any) => team.homeAway === "away");
        const home = competitors.find((team: any) => team.homeAway === "home");
        const kickoff = event.date ? new Date(event.date) : null;
        const state = event.status?.type?.state;
        const status = state === "in" ? "LIVE" : state === "post" ? "FINAL" : kickoff && !Number.isNaN(kickoff.getTime()) ? kickoff.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }) + " ET" : "Scheduled";
        return {
          id: String(event.id),
          date: kickoff && !Number.isNaN(kickoff.getTime()) ? kickoff.toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric" }) : "NFL",
          status,
          teams: {
            awayTeam: { name: away?.team?.displayName ?? "Away", logo: away?.team?.logo ?? "", webUrl: "", score: away?.score },
            homeTeam: { name: home?.team?.displayName ?? "Home", logo: home?.team?.logo ?? "", webUrl: "", score: home?.score },
          },
          location: { city: competition?.venue?.address?.city ?? "", stadium: competition?.venue?.fullName ?? "" },
          webUrl: `espn:${event.id}`, // Provider-specific ID routed to ESPN summary
          week,
        };
      });
      return NextResponse.json(games);
    } catch (error) {
      console.error("NFL weekly schedule fetch failed:", error);
      return NextResponse.json({ success: false, games: [], message: "NFL weekly schedule temporarily unavailable" }, { status: 502 });
    }
  }

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
