"use client";
import { useState } from "react";
import { useStandings } from "@/hooks/useStandings";

export default function CompactStandings({ sport }: { sport: string }) {
  const standings = useStandings(sport);
  const [active, setActive] = useState(0);
  if (!Array.isArray(standings)) return <p className="text-xs theme-muted">Loading standings…</p>;
  if (!standings.length) return <p className="text-xs theme-muted">Standings unavailable.</p>;
  const division = standings[Math.min(active, standings.length - 1)];
  const recordKey = division.headers.find((h: string) => /^(W-L|W|PTS|PCT|RECORD)$/i.test(h)) ?? division.headers[0];
  return <section className="dashboard-panel min-w-0 p-3 sm:p-4">
    <div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-sm font-bold">Standings</h2><span className="text-[10px] theme-muted">{sport.toUpperCase()}</span></div>
    <div className="mb-3 flex gap-1 overflow-x-auto pb-1">{standings.map((d, i) => <button key={i} type="button" onClick={() => setActive(i)} className={`shrink-0 rounded-md px-2 py-1 text-[10px] ${active === i ? "theme-accent-bg" : "theme-surface-raised theme-muted"}`}>{d.division}</button>)}</div>
    <div className="space-y-0.5">{division.rows.slice(0, 8).map((team: { rank: string; team: string; logo: string; teamUrl: string; [key: string]: string }, i: number) => <div key={`${team.team}-${i}`} className="flex items-center gap-2 rounded-md px-1 py-1.5 text-xs hover:bg-[var(--color-surface-raised)]"><span className="w-4 text-right theme-muted">{team.rank || i + 1}</span>{team.logo && <img src={team.logo} alt="" className="h-5 w-5 shrink-0 object-contain"/>}<a className="min-w-0 flex-1 truncate hover:underline" href={team.teamUrl}>{team.team}</a><span className="shrink-0 font-semibold theme-text-soft">{recordKey ? team[recordKey] : ""}</span></div>)}</div>
    {division.rows.length > 8 && <p className="mt-2 text-[10px] theme-muted">Showing top 8 of {division.rows.length} teams</p>}
  </section>;
}
