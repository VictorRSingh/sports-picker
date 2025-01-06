import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import { Player } from "@/interfaces/Player";

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
        webUrl: foundPlayer.webUrl
    }
    return NextResponse.json(playerObject);
}