import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Game } from '@/types/Game';

export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const sport = searchParams.get("sport");
    const webUrl = searchParams.get("webUrl");

    const url = `https://foxsports.com/${sport}/${webUrl}?tab=odds`;

  try {
    const response = await axios.get(url);
    const gameHTML = await response.data;

    const $ = cheerio.load(gameHTML);

    const gameContainer = $(".odds-sp-content");

    const teams = gameContainer.find(".sp-rows"); // Get both teams
    
    if (teams.length < 2) {
      console.error("Could not find both teams");
      return;
    }
    
    // const awayTeam = $(teams[0]); // First team = Away
    // const homeTeam = $(teams[1]); // Second team = Home
    
    // const game: Game = {
    //   webUrl: webUrl as string,
    //   teams.away: {
    //     team: awayTeam.find(".full-text").text().trim(),
    //     short: awayTeam.find(".abbr-text").text().trim(),
    //     spread: awayTeam.find(".sp-row-data").eq(0).text().trim(), // First column
    //     moneyline: awayTeam.find(".sp-row-data").eq(1).text().trim(), // Second column
    //     total: awayTeam.find(".sp-row-data").eq(2).text().trim() // Third column
    //   },
    //   home: {
    //     team: homeTeam.find(".full-text").text().trim(),
    //     short: homeTeam.find(".abbr-text").text().trim(),
    //     spread: homeTeam.find(".sp-row-data").eq(0).text().trim(),
    //     moneyline: homeTeam.find(".sp-row-data").eq(1).text().trim(),
    //     total: homeTeam.find(".sp-row-data").eq(2).text().trim()
    //   }
    // };
    
    return NextResponse.json({});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false});
  }
}