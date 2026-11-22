"use client";
import { useState } from "react";
import type { Game } from "@/types/Game";
import { useGame } from "@/hooks/useGame";
type Stat = { abbr?: string; name?: string; value?: string | number };
function Comparison({ data, leaders = false }: { data: any; leaders?: boolean }) {
  if (!data?.awayTeam && !data?.homeTeam) return <p className="py-3 text-xs theme-muted">Comparison data unavailable for this matchup.</p>;
  const away = data.awayTeam, home = data.homeTeam;
  const left: Stat[] = away?.stats ?? [], right: Stat[] = home?.stats ?? [];
  return <div className="min-w-0">
    <div className="grid grid-cols-[minmax(0,1fr)_65px_minmax(0,1fr)] items-center gap-2 border-b theme-border pb-2 text-center text-xs font-semibold"><div className="flex min-w-0 items-center justify-center gap-2">{away?.image && <img src={away.image} alt="" className="h-6 w-6 object-contain"/>}<span className="truncate">{away?.name || "Away"}</span></div><span className="text-[10px] theme-muted">STAT</span><div className="flex min-w-0 items-center justify-center gap-2">{home?.image && <img src={home.image} alt="" className="h-6 w-6 object-contain"/>}<span className="truncate">{home?.name || "Home"}</span></div></div>
    <div className="divide-y divide-[var(--color-border)]">{left.map((stat, i) => <div key={i} className="grid grid-cols-[minmax(0,1fr)_65px_minmax(0,1fr)] items-center gap-2 py-2 text-xs"><div className="min-w-0 text-right"><span className="font-semibold">{stat.value ?? "—"}</span>{leaders && <div className="truncate text-[10px] theme-muted" title={stat.name}>{stat.name}</div>}</div><span className="text-center text-[10px] font-semibold uppercase theme-muted">{stat.abbr}</span><div className="min-w-0"><span className="font-semibold">{right[i]?.value ?? "—"}</span>{leaders && <div className="truncate text-[10px] theme-muted" title={right[i]?.name}>{right[i]?.name}</div>}</div></div>)}</div>
  </div>;
}
function Spotlight({ player, label }: { player: any; label: string }) { return <div className="flex min-w-0 items-center gap-2">{player?.image ? <img src={player.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover"/> : <div className="h-10 w-10 shrink-0 rounded-full theme-surface-raised"/>}<div className="min-w-0"><div className="truncate text-xs font-semibold">{player?.webUrl ? <a href={player.webUrl} className="hover:underline">{player.name || label}</a> : player?.name || label}</div><div className="text-[10px] theme-muted">{player?.stats?.slice(0, 3).join(" · ") || "No player stats"}</div></div></div>; }
export default function GamePreview({ game, sport }: { game: Game; sport: string }) {
  const gameInfo = useGame(sport, game.webUrl), detail = gameInfo.game;
  const [comparison, setComparison] = useState<"stats" | "leaders">("stats");
  if (!detail) return <div className="dashboard-panel p-5 text-xs theme-muted">{gameInfo.loading ? "Loading matchup details…" : gameInfo.error ? `Unable to load matchup details: ${gameInfo.error}` : "Matchup details unavailable."}</div>;
  return <div className="dashboard-panel min-w-0 p-3 sm:p-4">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">{detail.featuredPairing?.title || "Featured matchup"}</h3><span className="text-[10px] theme-muted">{sport.toUpperCase()}</span></div>
    {(detail.featuredPairing?.awayPlayer || detail.featuredPairing?.homePlayer) && <div className="mb-3 grid grid-cols-1 gap-2 border-b theme-border pb-3 sm:grid-cols-2"><Spotlight player={detail.featuredPairing?.awayPlayer} label="Away player"/><Spotlight player={detail.featuredPairing?.homePlayer} label="Home player"/></div>}
    {detail.pregame && <p className="mb-3 text-xs theme-muted">Pregame matchup: box-score statistics and player leaders are not available until the game begins.</p>}
    <div className="mb-3 flex items-center justify-between gap-2"><h4 className="text-xs font-semibold">Team comparison</h4><div className="flex gap-1 rounded-lg theme-surface-raised p-1">{([ ["stats", "Team stats"], ["leaders", "Team leaders"] ] as const).map(([key, label]) => <button key={key} type="button" onClick={() => setComparison(key)} className={`rounded-md px-2 py-1 text-[10px] ${comparison === key ? "theme-accent-bg" : "theme-muted"}`}>{label}</button>)}</div></div>
    <Comparison data={comparison === "stats" ? detail.teamStatsComparison : detail.teamLeadersComparison} leaders={comparison === "leaders"}/>
  </div>;
}
