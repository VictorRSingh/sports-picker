import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { Player } from "@/interfaces/Player";
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest ) {
    const { searchParams } = new URL(request.url);
    const player = searchParams.get('player');
    const searchURL = `https://api.foxsports.com/bifrost/v1/search/content?text=${player}&apikey=jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq`

    const response = await axios.get(searchURL);
    const data = await response.data;
    const foundPlayer = data.results.find((item: any) => item.title === "PLAYERS").components[0].model;


    const playerObject: Player = {
        contentUri: foundPlayer.contentUri,
        image: foundPlayer.image.url,
        name: foundPlayer.title,
        team: foundPlayer.subtitle,
        webUrl: foundPlayer.webUrl,
        position: await getPlayerPosition(foundPlayer.webUrl) as string,
        sport: await getPlayerSport(foundPlayer.webUrl) as string
    }
    return NextResponse.json(playerObject);
}

const getPlayerPosition = async (playerUrl: string) => {
    try {
      // Fetch the player's page
      const positionResponse = await axios.get(`https://www.foxsports.com/${playerUrl}`);
      const positionData = positionResponse.data;
  
      // Load the HTML into Cheerio
      const $ = cheerio.load(positionData);
  
      // Select the element containing the position (e.g., SMALL FORWARD)
      const position = $('.entity-header .entity-title span').text().trim();
      // Extract only the position part from the text
      const positionMatch = position.match(/- (.+?) -/);
      return positionMatch ? positionMatch[1] : null;
    } catch (error) {
      console.error('Error fetching player position:', error);
      return null;
    }
  };

  const getPlayerSport = async (playerUrl: string) => {
    return playerUrl.includes('nba') ? 'nba' : playerUrl.includes('nfl') ? 'nfl' : playerUrl.includes('nhl') ? 'nhl' : 'nosport';
  }