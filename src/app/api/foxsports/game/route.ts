import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { Game } from "@/types/Game";
import { Stat } from "@/types/Stat";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const webUrl = searchParams.get("webUrl");

  const url = `https://foxsports.com${webUrl}`;

  try {
    const response = await axios.get(url);
    const gameHTML = await response.data;

    const $ = cheerio.load(gameHTML);

    const featuredPairingsContainer = $(".featured-pairing-container");
    const awayFeaturedPlayerStats: any[] = [];
    const homeFeaturedPlayerStats: any[] = [];

    featuredPairingsContainer
      .find(".players-data")
      .find(".left-entity")
      .find(".player-info .featured-stats span")
      .each((_, el) => {
        const row = $(el);

        awayFeaturedPlayerStats.push(row.text().trim());
      });

    featuredPairingsContainer
      .find(".players-data")
      .find(".right-entity")
      .find(".player-info .featured-stats span")
      .each((_, el) => {
        const row = $(el);

        homeFeaturedPlayerStats.push(row.text().trim());
      });

    const teamStatsComparisonContainer = $("[data-qa=teamStatsComparison]");
    const awayTeamStats: Stat[] = [];
    const homeTeamStats: Stat[] = [];

    $('[data-qa="teamStatsComparison"] .team-comparison-row').each((_, el) => {
      const row = $(el);

      // Away team's number (left column)
      const leftValue = row.find(".matchup-comparison-data.left").text().trim();

      // Home team's number (right column)
      const rightValue = row
        .find(".matchup-comparison-data.right")
        .text()
        .trim();

      // Stat abbreviation (middle column)
      const abbr = row.find(".matchup-comparison-text").text().trim();

      awayTeamStats.push({
        name: abbr,
        value: leftValue,
        abbr: abbr,
      });

      homeTeamStats.push({
        name: abbr,
        value: rightValue,
        abbr: abbr,
      });
    });

    const teamLeadersComparisonContainer = $("[data-qa=teamLeadersComparison]");
    const awayTeamLeadersStats: Stat[] = [];
    const homeTeamLeadersStats: Stat[] = [];

    teamLeadersComparisonContainer.find('.team-comparison-row').each((_, el) => {
      const row = $(el);

      // Away team's number (left column)
      // const leftValue = row.find(".matchup-comparison-data.left").text().trim();
      const leftName = row.find('.matchup-comparison-data.left .leader-stats a').text().trim();
      const leftValue = row.find('.matchup-comparison-data.left .leader-stats div').text().trim();

      // Home team's number (right column)
      // const rightValue = row
      //   .find(".matchup-comparison-data.right")
      //   .text()
      //   .trim();

      const rightName = row.find('.matchup-comparison-data.right .leader-stats a').text().trim();
      const rightValue = row.find('.matchup-comparison-data.right .leader-stats div').text().trim();

      // Stat abbreviation (middle column)
      const abbr = row.find(".matchup-comparison-text").text().trim();

      awayTeamLeadersStats.push({
        name: leftName,
        value: leftValue,
        abbr: abbr,
      });

      homeTeamLeadersStats.push({
        name: rightName,
        value: rightValue,
        abbr: abbr,
      });
    });

    const game: Game = {
      featuredPairing: {
        title: featuredPairingsContainer.find("h3").text().trim(),
        awayPlayer: {
          image: featuredPairingsContainer
            .find(".left-entity")
            .find(".player-headshot")
            .find("a img")
            .attr("src"),
          name: featuredPairingsContainer
            .find(".left-entity")
            .find(".player-info")
            .find(".player-name")
            .text()
            .trim(),
          webUrl: featuredPairingsContainer
            .find(".left-entity")
            .find(".player-info")
            .find("a")
            .attr("href"),
          stats: awayFeaturedPlayerStats,
        },
        homePlayer: {
          image: featuredPairingsContainer
            .find(".right-entity")
            .find(".player-headshot")
            .find("a img")
            .attr("src"),
          name: featuredPairingsContainer
            .find(".right-entity")
            .find(".player-info")
            .find(".player-name")
            .text()
            .trim(),
          webUrl: featuredPairingsContainer
            .find(".right-entity")
            .find(".player-info")
            .find("a")
            .attr("href"),
          stats: homeFeaturedPlayerStats,
        },
      },
      teamStatsComparison: {
        title: teamStatsComparisonContainer.find("h3").text().trim(),
        awayTeam: {
          name: teamStatsComparisonContainer
            .find(".matchup-team-comparison")
            .find(".start")
            .find("span")
            .eq(0)
            .text()
            .trim(),
          image: teamStatsComparisonContainer
            .find(".matchup-team-comparison")
            .find(".start")
            .find("span img")
            .attr("src"),
          sport: sport!,
          stats: awayTeamStats,
        },
        homeTeam: {
          name: teamStatsComparisonContainer
            .find(".matchup-team-comparison")
            .find(".end")
            .find("span")
            .eq(0)
            .text()
            .trim(),
          image: teamStatsComparisonContainer
            .find(".matchup-team-comparison")
            .find(".end")
            .find("span img")
            .attr("src"),
          sport: sport!,
          stats: homeTeamStats,
        },
      },
      teamLeadersComparison: {
        title: teamLeadersComparisonContainer.find("h3").text().trim(),
        awayTeam: {
          name: teamLeadersComparisonContainer
            .find(".matchup-team-comparison")
            .find(".start")
            .find("span")
            .eq(0)
            .text()
            .trim(),
          image: teamLeadersComparisonContainer
            .find(".matchup-team-comparison")
            .find(".start")
            .find("span img")
            .attr("src"),
          sport: sport!,
          stats: awayTeamLeadersStats,
        },
        homeTeam: {
          name: teamLeadersComparisonContainer
            .find(".matchup-team-comparison")
            .find(".end")
            .find("span")
            .eq(0)
            .text()
            .trim(),
          image: teamLeadersComparisonContainer
            .find(".matchup-team-comparison")
            .find(".end")
            .find("span img")
            .attr("src"),
          sport: sport!,
          stats: homeTeamLeadersStats,
        },
      },
    };

    return NextResponse.json({ ...game });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}
