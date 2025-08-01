import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { TeamStats } from "@/types/TeamStats";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const teamUrl = searchParams.get("teamUrl");

  const url = `https://www.foxsports.com/${sport}/${teamUrl}-stats`;

  try {
    const response = await axios.get(url);
    const statsHTML = await response.data;

    const $ = cheerio.load(statsHTML);

    const teamStatsContainer = $(".entity-container");

    // Extract team stats from the "TEAM STATS" section
    const teamStats: TeamStats[] = [];

    teamStatsContainer.find('.stats-overview-header').each((_, header) => {
      const headerText = $(header).text().trim();
      const statsContainer = $(header).next('.stats-overview-container');
      if (statsContainer.length) {
      const rows: TeamStats["rows"] = [];
      const columns: TeamStats["headers"]["columns"] = [];

      statsContainer.find('.stats-overview').each((i, statEl) => {
        const statName = $(statEl).find('.stat-name').text().trim();
        const statValue = $(statEl).find('.stat-data .fs-54, .stat-data .fs-sm-40').first().text().trim();
        const statAbbr = $(statEl).find('.stat-abbr').text().trim();
        const statLeaderInfo = $(statEl).find('.stat-leader-info').text().trim();
        const statImage = $(statEl).find('.stat-image img').attr('src') || "";
        // Add the first row with headers

        if (i === 0) {
        columns.push({ index: 0, text: "Stat" });
        columns.push({ index: 1, text: "Value" });
        columns.push({ index: 2, text: "Abbr" })
        columns.push({ index: 3, text: "Leader" });
        if (statImage) {
          columns.push({ index: 4, text: "Image" });
        }
      }

        rows.push({
        columns: [
          { index: 0, text: statName },
          { index: 1, text: statValue },
          { index: 2, text: statAbbr },
          { index: 3, text: statLeaderInfo },
          { index: 4, text: statImage }
        ]
        });
      });

      teamStats.push({
        category: headerText,
        sport: sport ?? "",
        team: teamUrl ?? "",
        standings: "",
        headers: { columns },
        rows
      });
      }
    });

    return NextResponse.json(teamStats as TeamStats[]);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}
