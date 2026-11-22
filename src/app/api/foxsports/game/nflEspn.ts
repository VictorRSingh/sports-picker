import { NextResponse } from "next/server";

export async function nflEspnGame(gameId: string) {
  if (!/^\d{5,15}$/.test(gameId)) return NextResponse.json({ error: "Invalid ESPN game ID" }, { status: 400 });
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    const response = await fetch(url, { next: { revalidate: 180 }, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`ESPN summary returned ${response.status}`);
    const data = await response.json();
    const competitors = data.header?.competitions?.[0]?.competitors ?? data.boxscore?.teams?.map((t: any) => t.team) ?? [];
    const find = (side: string) => competitors.find((c: any) => c.homeAway === side);
    const away = find("away"), home = find("home");
    if (!away || !home) throw new Error("ESPN matchup teams unavailable");
    const team = (c: any) => ({ name: c.team?.displayName ?? c.team?.name ?? "Team", image: c.team?.logo ?? c.team?.logos?.[0]?.href ?? "", sport: "nfl" });
    const boxTeams = data.boxscore?.teams ?? [];
    const statsFor = (c: any) => {
      const item = boxTeams.find((t: any) => String(t.team?.id) === String(c.team?.id));
      return (item?.statistics ?? []).map((s: any) => ({ abbr: s.label ?? s.name ?? "", name: s.label ?? s.name ?? "", value: String(s.displayValue ?? s.value ?? "—") }));
    };
    const aStats = statsFor(away), hStats = statsFor(home);
    const hMap = new Map(hStats.map((s: any) => [s.abbr, s]));
    const common = aStats.filter((s: any) => hMap.has(s.abbr));
    const awayStats = common;
    const homeStats = common.map((s: any) => hMap.get(s.abbr));
    const leaders = data.leaders ?? [];
    const leaderFor = (c: any) => {
      const item = leaders.find((l: any) => String(l.team?.id) === String(c.team?.id));
      return (item?.leaders ?? []).map((l: any) => ({ abbr: l.displayName ?? l.name ?? "", name: l.leaders?.[0]?.athlete?.displayName ?? "", value: l.leaders?.[0]?.displayValue ?? "—", webUrl: l.leaders?.[0]?.athlete?.links?.find((link: any) => typeof link?.href === "string" && /^https:\/\/(www\.)?espn\.com\/nfl\/player\//.test(link.href))?.href }));
    };
    const aLeaders = leaderFor(away), hLeaders = leaderFor(home);
    const leaderMap = new Map(hLeaders.map((s: any) => [s.abbr, s]));
    const sharedLeaders = aLeaders.filter((s: any) => leaderMap.has(s.abbr));
    return NextResponse.json({
      featuredPairing: { title: `${team(away).name} vs ${team(home).name}` },
      teamStatsComparison: { title: "Team statistics", awayTeam: { ...team(away), stats: awayStats }, homeTeam: { ...team(home), stats: homeStats } },
      teamLeadersComparison: { title: "Team leaders", awayTeam: { ...team(away), stats: sharedLeaders }, homeTeam: { ...team(home), stats: sharedLeaders.map((s: any) => leaderMap.get(s.abbr)) } },
      pregame: !aStats.length,
      status: data.header?.competitions?.[0]?.status?.type?.description ?? "Scheduled",
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "NFL matchup unavailable" }, { status: 502 });
  }
}
