import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const player = searchParams.get("player");
  console.log(player)
  const url =
    sport &&
    player &&
    `https://www.googleapis.com/customsearch/v1?key=AIzaSyAsGnxj0zbRhlDujku34zv4iGScr0ABSDs&cx=8181e3174b67b4530&q=covers.com+${sport}+${player}&num=1`;

    console.log(url);
  try {
    if (url) {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        },
      });

      const data = await response.data;
      return NextResponse.json(data.items[0].link);
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}
