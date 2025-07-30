import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const url = `https://foxsports.com/${sport}/standings`;

    if (!sport) {
        return NextResponse.json({ error: "Sport parameter is required" }, { status: 400 });
    }
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const standings: any[] = [];
        const standingsContainer = $(".live-standings-wrapper");

        const standingsTitle = standingsContainer.find(".title-container h2").text().trim();

        standingsContainer.find("table.data-table").each((_, table) => {
            const $table = $(table);
            const division = $table.find("thead th").first().find("h2").text().trim();

            // Get headers, skipping the first th (division)
            const headers: string[] = [];
            $table.find("thead th").slice(1).each((_, th) => {
                const headerText = $(th).text().trim();
                headers.push(headerText);
            });

            // Get rows
            const rows: any[] = [];
            $table.find("tbody tr").each((_, tr) => {
                const row: any = {};
                // First column: rank
                row.rank = $(tr).find("td").eq(0).find(".cell-rank span").text().trim();
                // Second column: team name, logo, url
                const entityTd = $(tr).find("td").eq(1);
                row.team = entityTd.find("a .table-entity-name").first().text().trim();
                row.logo = entityTd.find("img").attr("src") || "";
                row.teamUrl = entityTd.find(".table-entity-name").attr("href") || "";
                // Remaining columns: stats
                $(tr).find("td").slice(2).each((i, td) => {
                    const header = headers[i];
                    row[header] = $(td).find(".table-result").text().trim();
                });
                rows.push(row);
            });

            standings.push({
                standingsTitle,
                division,
                headers,
                rows,
            });
        });
        return NextResponse.json(standings);
    } catch (error) {
        console.error("Error fetching standings:", error);
        return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
    }
}
