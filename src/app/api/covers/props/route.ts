import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { PlayerProps } from "@/types/PlayerProps";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "Missing player URL" }, { status: 400 });
  let url: URL;
  try { url = new URL(raw); } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }
  if (!(["covers.com", "www.covers.com"].includes(url.hostname)) || url.protocol !== "https:" || !url.pathname.includes("/players/")) return NextResponse.json({ error: "Unsupported player URL" }, { status: 400 });
  try {
    const response = await fetch(url, { headers: { "User-Agent": "SportsPickerResearch/1.0", Accept: "text/html" }, next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json({ error: `Covers returned ${response.status}` }, { status: 502 });
    const $ = cheerio.load(await response.text());
    const result: PlayerProps[] = [];
    $(".covers-CoversPlayer-Prop-Event").each((_, section) => {
      const market = $(section).find("h2").first().text().trim();
      if (!market) return;
      const props: PlayerProps["props"] = [];
      $(section).find(".covers-CoversPlayer-Prop-Card .other-odds-row").each((_, row) => {
        const imageUrl = $(row).find(".other-odds-label img").attr("src") || "";
        const overElement = $(row).find(".other-over-odds a");
        const underElement = $(row).find(".other-under-odds a");
        const lineOf = (value: string) => value.match(/(?:^|\s)[ou]?\s*(\d+(?:\.\d+)?)/i)?.[1] || "";
        const over = { line: lineOf(overElement.text()), odd: overElement.find("span").text().trim() };
        const under = { line: lineOf(underElement.text()), odd: underElement.find("span").text().trim() };
        if (!over.line && !under.line) return;
        props.push({ sportsbook: { name: imageUrl.split("/").pop()?.replace(/\.svg(?:\?.*)?$/, "") || "Unknown", imageUrl }, over, under });
      });
      if (props.length) result.push({ market, props });
    });
    return NextResponse.json({ source: url.toString(), fetchedAt: new Date().toISOString(), markets: result, status: result.length ? "available" : "unavailable", note: result.length ? "Verify game date and sportsbook before using a line; extracted listings may include stale markets." : "No current prop listings could be extracted. Covers may have changed its page structure or rendered markets dynamically." });
  } catch { return NextResponse.json({ error: "Could not retrieve Covers props" }, { status: 502 }); }
}
