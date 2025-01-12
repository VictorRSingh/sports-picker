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
    const players = data.results.find((category: any) => category.title === 'PLAYERS')?.components ?? [];

    const playersArray: Player[] = players.map((player: any) => {
      const p: Player = {
        contentUri: player.model.contentUri,
        image: player.model.image.url,
        name: player.model.title,
        sport: player.model.webUrl.split('/')[1], 
        position: "",
        team: player.model.subtitle,
        webUrl: player.model.webUrl
      }

      return p;
    });

    return NextResponse.json(playersArray);
}
