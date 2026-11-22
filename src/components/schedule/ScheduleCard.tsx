"use client";

import { useEffect, useMemo, useState } from "react";
import GameCard from "@/components/schedule/GameCard";
import Link from "next/link";
import GamePreview from "@/components/game/GamePreview";
import MatchupInsights from "@/components/game/MatchupInsights";
import { useSchedule } from "@/hooks/useSchedule";
import type { Game } from "@/types/Game";

export default function ScheduleCard({ sport, sidebar }: { sport: string; sidebar?: React.ReactNode }) {
  const [nflYear, setNflYear] = useState(() => new Date().getFullYear());
  const [nflStage, setNflStage] = useState(2);
  const [nflWeek, setNflWeek] = useState(() => {
    // Regular season week 1 starts on the first Thursday after Labor Day.
    const year = new Date().getFullYear();
    const septemberFirst = new Date(Date.UTC(year, 8, 1));
    const laborDay = 1 + ((8 - septemberFirst.getUTCDay()) % 7);
    const firstThursday = laborDay + 3;
    const firstKickoff = Date.UTC(year, 8, firstThursday);
    return Math.min(18, Math.max(1, Math.floor((Date.now() - firstKickoff) / 604800000) + 1));
  });
  const schedule = useSchedule(sport, sport === "nfl" ? nflWeek : undefined, sport === "nfl" ? nflYear : undefined, sport === "nfl" ? nflStage : undefined);
  const games: Game[] = useMemo(() => Array.isArray(schedule) ? schedule : Array.isArray(schedule?.games) ? schedule.games : [], [schedule]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "players" | "trends" | "analysis">("overview");
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { setSelectedId(null); setTab("overview"); setShowAll(false); }, [sport]);
  useEffect(() => { setSelectedId(null); setShowAll(false); }, [nflWeek, nflYear, nflStage]);
  const selected = games.find((g) => String(g.id ?? g.webUrl) === selectedId) ?? games[0];
  const live = games.filter((g) => /live|progress|quarter|period|inning|half/i.test(String(g.status ?? ""))).length;
  const title = sport.toUpperCase();
  const visible = showAll ? games : games.slice(0, 8);
  const detailHref = selected?.webUrl ? `/${sport}/game?webUrl=${encodeURIComponent(String(selected.webUrl))}` : null;
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] theme-highlight">LEAGUE COMMAND CENTER</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title} <span className="theme-muted">Hub</span></h1><p className="mt-1 text-xs theme-muted">Scores, matchups, team comparisons and standings in one place.</p></div>
        <span className="rounded-full border theme-border theme-surface px-4 py-2 text-xs theme-muted">{title} · League overview</span>
      </header>
      {sport === "nfl" && <div className="flex flex-wrap items-center gap-2 rounded-lg border theme-border theme-surface p-3 text-sm">
        <label className="theme-muted">Season <select className="ml-2 rounded-md border theme-border theme-surface-raised px-2 py-1.5" value={nflYear} onChange={e => setNflYear(Number(e.target.value))}>{[nflYear-1,nflYear,nflYear+1].map(y => <option key={y} value={y}>{y}</option>)}</select></label>
        <label className="theme-muted">Stage <select className="ml-2 rounded-md border theme-border theme-surface-raised px-2 py-1.5" value={nflStage} onChange={e => {setNflStage(Number(e.target.value));setNflWeek(1);}}><option value={1}>Preseason</option><option value={2}>Regular season</option><option value={3}>Playoffs</option></select></label>
        <button className="rounded-md border theme-border px-3 py-1.5 disabled:opacity-40" disabled={nflWeek <= 1} onClick={() => setNflWeek(w => Math.max(1,w-1))}>← Previous</button>
        <label className="theme-muted">Week <select className="ml-2 rounded-md border theme-border theme-surface-raised px-2 py-1.5" value={nflWeek} onChange={e => setNflWeek(Number(e.target.value))}>{Array.from({length: nflStage===2?18:nflStage===1?3:5},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>
        <button className="rounded-md border theme-border px-3 py-1.5 disabled:opacity-40" disabled={nflWeek >= (nflStage===2?18:nflStage===1?3:5)} onClick={() => setNflWeek(w => w+1)}>Next →</button>
      </div>}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border theme-border theme-surface px-3 py-2 text-xs"><span className="theme-muted">Games <strong className="ml-1 theme-text">{games.length}</strong></span><span className="theme-muted">Live <strong className="ml-1 theme-text">{live}</strong></span><span className="theme-muted">Selected <strong className="ml-1 theme-text">{selected ? `${selected.teams?.awayTeam?.name ?? "Away"} vs ${selected.teams?.homeTeam?.name ?? "Home"}` : "—"}</strong></span></div>
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-bold">Matchup board</h2><p className="text-xs theme-muted">Choose a game to update the analysis panel</p></div>{games.length > 8 && <button className="rounded-lg border theme-border px-3 py-2 text-xs theme-hover-surface" onClick={() => setShowAll(!showAll)}>{showAll ? "Show fewer" : `View all ${games.length}`}</button>}</div>
        {!schedule && <div className="dashboard-panel p-8 text-center theme-muted">Loading schedule…</div>}
        {schedule && games.length === 0 && <div className="dashboard-panel p-8 text-center theme-muted">No games available from the current schedule feed. Explore standings below.</div>}
        {games.length > 0 && <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((game, i) => { const id = String(game.id ?? game.webUrl ?? i); return <button key={id} type="button" aria-pressed={selected === game} className="min-w-0 text-left" onClick={() => { setSelectedId(id); setTab("overview"); }}><GameCard game={game} sport={sport} selected={selected === game}/></button>; })}</div>}
      </section>
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]"><section className="min-w-0 space-y-2" id="matchup-analysis">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.2em] theme-highlight">GAME CENTER</p><h2 className="mt-1 text-xl font-bold">Matchup analysis</h2>{detailHref && <Link href={detailHref} className="mt-2 inline-flex rounded-md border theme-border px-3 py-1.5 text-xs font-semibold theme-hover-surface">Open full game analysis ↗</Link>}</div><div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border theme-border theme-surface p-1">{([ ["overview", "Overview"], ["players", "Players"], ["trends", "Trends"], ["analysis", "AI Analysis"] ] as const).map(([key,label]) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors ${tab===key ? "theme-accent-bg" : "theme-muted theme-hover-surface"}`}>{label}</button>)}</div></div>
        {selected ? <div className="min-w-0">{tab === "overview" ? <GamePreview key={`${sport}-${selected.webUrl ?? selected.id}`} game={selected} sport={sport} /> : <MatchupInsights key={`${sport}-${selected.webUrl ?? selected.id}-${tab}`} sport={sport} webUrl={String(selected.webUrl||"")} tab={tab}/>}</div> : <div className="dashboard-panel p-8 text-center theme-muted">Select a game to explore its matchup.</div>}
      </section><aside className="min-w-0">{sidebar}</aside></div>
    </div>
  );
}
function Metric({label,value,detail}:{label:string;value:string;detail:string}) { return <div className="dashboard-panel min-w-0 p-4 sm:p-5"><p className="text-[11px] font-semibold uppercase tracking-wider theme-muted">{label}</p><div className="mt-3 truncate text-3xl font-bold tracking-tight">{value}</div><p className="mt-2 truncate text-xs theme-muted">{detail}</p></div>; }
