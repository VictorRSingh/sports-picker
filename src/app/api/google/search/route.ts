import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const paths: Record<string, string> = {
  nba: "basketball/nba", nfl: "football/nfl", nhl: "hockey/nhl",
  mlb: "baseball/mlb", wnba: "basketball/wnba",
};

// Explicitly verified identities; independent of FOX Sports player slugs.
const known: Record<string, string> = {
  "nba:cade cunningham": "https://www.covers.com/sport/basketball/nba/players/222424/cade-cunningham",
  "nfl:josh allen": "https://www.covers.com/sport/football/nfl/players/32554/josh-allen",
  "nfl:josh allen:buffalo bills": "https://www.covers.com/sport/football/nfl/players/32554/josh-allen",
  "nhl:sebastian aho": "https://www.covers.com/sport/hockey/nhl/players/17503/sebastian-aho",
  "nhl:sebastian aho:carolina hurricanes": "https://www.covers.com/sport/hockey/nhl/players/17503/sebastian-aho",
};

const cache = new Map<string, { url: string; expires: number }>();
const clean = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

function candidateUrl(href: string, sport: string, base: string): string | null {
  try {
    let url = new URL(href, base);
    if (["google.com", "www.google.com"].includes(url.hostname) && url.pathname === "/url") {
      url = new URL(url.searchParams.get("q") || url.searchParams.get("url") || "");
    }
    if (url.protocol !== "https:" || !["www.covers.com", "covers.com"].includes(url.hostname)) return null;
    if (!new RegExp(`^/sport/${paths[sport]}/players/\\d+/[a-z0-9-]+/?$`).test(url.pathname)) return null;
    return `https://www.covers.com${url.pathname.replace(/\/$/, "")}`;
  } catch { return null; }
}

async function verify(url: string, name: string, team: string): Promise<boolean> {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SportsPicker/1.0)", Accept: "text/html" }, signal: AbortSignal.timeout(6500), next: { revalidate: 3600 } });
    if (!response.ok) return false;
    const $ = cheerio.load(await response.text());
    const heading = clean($("h1").first().text() || $("title").text());
    const expected = clean(name);
    // Verify the name in the page title; the URL slug alone is not sufficient.
    if (!heading.includes(expected)) return false;
    if (team) {
      const pageText = clean($("body").text().slice(0, 30000));
      if (!pageText.includes(clean(team))) return false;
    }
    return true;
  } catch { return false; }
}

export async function GET(request: NextRequest) {
  const sport = (request.nextUrl.searchParams.get("sport") || "").toLowerCase();
  const rawName = request.nextUrl.searchParams.get("name") || "";
  const playerSlug = request.nextUrl.searchParams.get("player") || "";
  const name = rawName.trim() || playerSlug.replace(/-\d+-player$/, "").replace(/-player$/, "").replace(/-/g, " ");
  const team = (request.nextUrl.searchParams.get("team") || "").trim();
  if (!paths[sport] || !name || name.length > 100 || team.length > 100) return NextResponse.json({ error: "Invalid player, team or sport" }, { status: 400 });

  const key = `${sport}:${clean(name)}${team ? `:${clean(team)}` : ""}`;
  const explicit = known[key] || known[`${sport}:${clean(name)}`];
  if (explicit) return NextResponse.json({ url: explicit, discovery: "known" });
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return NextResponse.json({ url: hit.url, discovery: "cached" });

  const q = `site:covers.com/sport/${paths[sport]}/players/ "${name}" ${team}`;
  const providers = [
    `https://www.google.com/search?${new URLSearchParams({ q, num: "10" })}`,
    `https://www.bing.com/search?${new URLSearchParams({ q })}`,
  ];
  const tested = new Set<string>();
  for (const endpoint of providers) {
    try {
      const response = await fetch(endpoint, { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" }, signal: AbortSignal.timeout(7000), next: { revalidate: 3600 } });
      if (!response.ok) continue;
      const $ = cheerio.load(await response.text());
      const candidates: string[] = [];
      $("a[href]").each((_, el) => {
        const candidate = candidateUrl($(el).attr("href") || "", sport, endpoint);
        if (candidate && !tested.has(candidate)) { tested.add(candidate); candidates.push(candidate); }
      });
      for (const candidate of candidates.slice(0, 8)) {
        if (await verify(candidate, name, team)) {
          cache.set(key, { url: candidate, expires: Date.now() + 24 * 3600_000 });
          return NextResponse.json({ url: candidate, discovery: "verified-search" });
        }
      }
    } catch { /* Best-effort public search; don't bypass access controls. */ }
  }
  return NextResponse.json({ error: "No verified Covers profile found. Automated search may be blocked, or no matching profile exists.", code: "PLAYER_NOT_FOUND" }, { status: 404 });
}
