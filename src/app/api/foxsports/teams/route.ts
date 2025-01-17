import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio';
import { Team } from "@/types/Team";

export async function GET(request: NextRequest) {
  //Get Sport from query
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");

  //Create URL to query from
  const url = `https://foxsports.com/${sport}/teams`;
    console.log(url);
  try {
    //Fetch the HTML
    const response = await axios.get(url);
    const teamsHTML = await response.data;

    const $ = cheerio.load(teamsHTML);

    //Create an array of teams
    const teams: Team[] = [];

    //Get the class that holds each team and get the link and their name
    $(".entity-teams-list .entity-list-group").find("a").each((_, team) => {
        const name = $(team).text().trim();
        const webUrl = $(team).attr("href");
        const imageTag = $(team).find(".image-wrapper img");
        const imgSrc = imageTag.attr("src");

        // Add found team to teams
        if(name && webUrl && sport && imgSrc) {
            teams.push({
                name: name,
                webUrl: webUrl,
                sport: sport,
                image: imgSrc
            })
        }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Failed fetching teams", error);
    return NextResponse.json({message: "Failed to fetch team"})
  }
}
