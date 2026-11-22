"use client";

import { useMemo } from "react";
import type { Gamelog } from "@/types/Gamelog";
import type { Player } from "@/types/Player";

interface PlayerGameLogsProps { player: Player; gameLogs: Gamelog }

export default function PlayerGameLogs({ gameLogs }: PlayerGameLogsProps) {
  const headers = gameLogs?.headers?.columns ?? [];
  const rows = gameLogs?.rows ?? [];
  const summary = useMemo(() => {
    const average = (key: string) => {
      const index = headers.findIndex(h => h.text.trim().toUpperCase() === key);
      const values = index < 0 ? [] : rows.map(r => Number(r.columns[index]?.text)).filter(Number.isFinite);
      return values.length ? (values.reduce((a,b) => a+b, 0) / values.length).toFixed(1) : "—";
    };
    return [{name:"Points",value:average("PTS")},{name:"Rebounds",value:average("REB")},{name:"Assists",value:average("AST")},{name:"Games",value:String(rows.length)}];
  },[headers,rows]);

  if (!rows.length) return <div className="dashboard-panel p-5 text-sm theme-muted">No game logs available for this season.</div>;
  return <section className="space-y-4">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {summary.map(item => <div key={item.name} className="dashboard-panel rounded-xl p-4"><p className="text-xs theme-muted">{item.name === "Games" ? "Games recorded" : `Average ${item.name.toLowerCase()}`}</p><p className="mt-2 text-2xl font-bold tracking-tight">{item.value}</p></div>)}
    </div>
    <div className="dashboard-panel overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b theme-border p-4">
        <div><h2 className="font-semibold">Game-by-game performance</h2><p className="mt-1 text-xs theme-muted">{rows.length} games · FOX Sports · newest first</p></div>
        <span className="rounded-full border theme-border px-3 py-1 text-xs theme-muted">Scroll horizontally for all stats</span>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-sm">
          <thead><tr>{headers.map((header,i)=><th key={`${header.text}-${i}`} scope="col" className={`whitespace-nowrap border-b theme-border bg-slate-800/80 px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-300 ${i===0?'sticky left-0 z-20 min-w-[142px] text-left':''} ${['PTS','REB','AST'].includes(header.text.toUpperCase())?'text-violet-300':''}`}>{header.text}</th>)}</tr></thead>
          <tbody>{rows.map((row,ri)=> <tr key={ri} className="group hover:bg-violet-500/[0.08]">{headers.map((header,ci)=>{
            const value = row.columns[ci]?.text ?? '—';
            const highlight = ['PTS','REB','AST'].includes(header.text.toUpperCase());
            return <td key={`${ri}-${ci}`} className={`whitespace-nowrap border-b theme-border px-3 py-3 text-center tabular-nums ${ri%2===0?'bg-slate-900/25':'bg-slate-800/20'} ${ci===0?'sticky left-0 z-10 text-left font-semibold text-slate-100 '+(ri%2===0?'!bg-[#151b26]':'!bg-[#1b2230]'):''} ${highlight?'font-semibold text-violet-200':'theme-text-soft'}`}>{value}</td>;
          })}</tr>)}</tbody>
        </table>
      </div>
    </div>
  </section>;
}
