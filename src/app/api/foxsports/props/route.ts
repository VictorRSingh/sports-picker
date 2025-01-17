import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {

    const { searchParams } = request.nextUrl;
    const sport = searchParams.get("sport");

    const url = `https://www.foxsports.com/odds/${sport}/props`

    try {
        const response = await axios.get(url);
        const propsHTML = await response.data;

        const $ = cheerio.load(propsHTML);

        
        return NextResponse.json({message: "Test"})
    } catch (error) {
        console.error("Failed to get props");
        return NextResponse.json({message: "Failed to get props"});
    }
}