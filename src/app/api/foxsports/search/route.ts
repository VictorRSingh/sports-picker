import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { SearchResults } from "@/types/SearchResults";
import { Team } from "@/types/Team";
import { Player } from "@/types/Player";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");

  const url = `https://api.foxsports.com/bifrost/v1/search/content?text=${q}&apikey=jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq`;

  try {
    const response = await axios.get(url);
    const data = await response.data;

    const results: SearchResults = {
      players: [],
      teams: [],
    };

    data.results.forEach((category: any) => {
      switch (category.title) {
        case "PLAYERS": {
          category.components.forEach((foundPlayer: any) => {
            const player: Player = {
                name: foundPlayer.model.title,
                image: foundPlayer.model.image?.url,
                webUrl: foundPlayer.model.webUrl
            }
            results.players.push(player);
          })
          break;
        }
        case "TEAMS": {
          category.components.forEach((foundTeam: any) => {
            const team: Team = {
                name: foundTeam.model.title,
                image: foundTeam.model.image?.url,
                sport: foundTeam.model.webUrl.split("/")[1],
                webUrl: foundTeam.model.webUrl,
            }
            results.teams.push(team);
          })
          break;
        }
        default: {
          break;
        }
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search", error);
    return NextResponse.json({ message: "Failed to search" });
  }
}
