import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { playerProfileHref } from "@/lib/playerProfileLink";

export const runtime = "nodejs";
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const nflTeams: Record<string,string> = {"buffalo bills":"BUF","miami dolphins":"MIA","new england patriots":"NE","new york jets":"NYJ","baltimore ravens":"BAL","cincinnati bengals":"CIN","cleveland browns":"CLE","pittsburgh steelers":"PIT","houston texans":"HOU","indianapolis colts":"IND","jacksonville jaguars":"JAX","tennessee titans":"TEN","denver broncos":"DEN","kansas city chiefs":"KC","las vegas raiders":"LV","los angeles chargers":"LAC","dallas cowboys":"DAL","new york giants":"NYG","philadelphia eagles":"PHI","washington commanders":"WAS","chicago bears":"CHI","detroit lions":"DET","green bay packers":"GB","minnesota vikings":"MIN","atlanta falcons":"ATL","carolina panthers":"CAR","new orleans saints":"NO","tampa bay buccaneers":"TB","arizona cardinals":"ARI","los angeles rams":"LAR","san francisco 49ers":"SF","seattle seahawks":"SEA"};
function matchesTeam(actual: string, requested: string, sport: string) {
  const a=normalize(actual), r=normalize(requested);
  if (!a || !r) return false;
  if (a===r || (a.length>=4 && r.includes(a)) || (r.length>=4 && a.includes(r))) return true;
  if (sport==="nfl") { const abbr=nflTeams[requested.toLowerCase().trim()]; if(abbr && a===normalize(abbr))return true; }
  return false;
}
const cache = new Map<string, {href:string|null; expires:number}>();
export async function GET(request: NextRequest) {
  const {searchParams}=request.nextUrl;
  const name=(searchParams.get("name")||"").trim();
  const sport=(searchParams.get("sport")||"").toLowerCase();
  const team=(searchParams.get("team")||"").trim();
  if (!name || !team || !["nba","nfl","nhl","mlb","wnba"].includes(sport)) return NextResponse.json({href:null,reason:"Missing player, league, or team"},{status:400});
  const key=[sport,normalize(name),normalize(team)].join(":");
  const hit=cache.get(key); if(hit && hit.expires>Date.now())return NextResponse.json({href:hit.href,source:"cache"});
  try {
    const endpoint=`https://api.foxsports.com/bifrost/v1/search/content?${new URLSearchParams({text:name,apikey:"jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq"})}`;
    const response=await fetch(endpoint,{signal:AbortSignal.timeout(7000),cache:"no-store"});
    if(!response.ok)throw new Error(`Search HTTP ${response.status}`);
    const data=await response.json();
    const results=(data.results||[]).filter((x:{title?:string})=>x.title==="PLAYERS").flatMap((x:{components?:unknown[]})=>x.components||[]) as {model?:{title?:string;webUrl?:string}}[];
    const candidates=results.filter(p=>p.model?.title && normalize(p.model.title)===normalize(name)).map(p=>({href:playerProfileHref(sport,p.model?.webUrl),webUrl:p.model?.webUrl})).filter((p):p is {href:string;webUrl:string}=>!!p.href && !!p.webUrl).slice(0,8);
    const verified=await Promise.all(candidates.map(async c=>{
      try {
        const path=new URL(c.webUrl,"https://www.foxsports.com").pathname;
        const r=await fetch(`https://www.foxsports.com${path}-stats`,{signal:AbortSignal.timeout(6000),headers:{"User-Agent":"Mozilla/5.0"}});
        if(!r.ok)return null;
        const $=cheerio.load(await r.text());
        const header=$(".entity-container .entity-header");
        const actualName=header.find(".entity-title .title span").eq(0).text().trim();
        const details=header.find(".entity-title .title span").eq(1).text().trim();
        const actualTeam=details.split(" - ").slice(2).join(" - ").trim();
        return normalize(actualName)===normalize(name) && matchesTeam(actualTeam,team,sport)?c.href:null;
      } catch{return null;}
    }));
    const unique=[...new Set(verified.filter((v):v is string=>!!v))];
    const href=unique.length===1?unique[0]:null;
    cache.set(key,{href,expires:Date.now()+(href?86400000:300000)});
    return NextResponse.json({href,source:"verified",reason:href?undefined:unique.length>1?"Ambiguous player":"No matching player and team"});
  } catch {return NextResponse.json({href:null,reason:"Player lookup unavailable"});}
}
