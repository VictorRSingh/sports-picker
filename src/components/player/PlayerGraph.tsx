"use client";

import { useMemo, type Dispatch, type SetStateAction } from "react";
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, BarController, LineController } from "chart.js";
import { Chart } from "react-chartjs-2";
import type { Gamelog } from "@/types/Gamelog";

ChartJS.register(CategoryScale,LinearScale,BarElement,LineElement,PointElement,Tooltip,Legend,BarController,LineController);

interface PlayerGraphProps { gameLogs:Gamelog; selectedStat:string; setSelectedStat:Dispatch<SetStateAction<string>> }
const preferred = ["PTS","G","A","SOG","SHOTS","S","HITS","HIT","BLK","BS","TOI","PIM","+/-","REB","AST","MIN","3FG","STL","TO"];
const numeric = (value: string | undefined): number | null => {
  const trimmed = value?.trim() ?? "";
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return null;
  const result = Number(trimmed);
  return Number.isFinite(result) ? result : null;
};

export default function PlayerGraph({gameLogs,selectedStat,setSelectedStat}:PlayerGraphProps) {
  const headers = gameLogs.headers.columns;
  const rows = gameLogs.rows;
  const available = useMemo(()=>headers.slice(1).filter(h=>rows.some(r=>numeric(r.columns[h.index]?.text) !== null)),[headers,rows]);
  const chosen = useMemo(()=>{
    const prioritized = preferred.flatMap(name => available.filter(h => h.text.trim().toUpperCase() === name).map(h => h.text));
    const fallback = available.map(h => h.text).filter(name => !prioritized.includes(name));
    const all = [...prioritized, ...fallback];
    return selectedStat && all.includes(selectedStat) ? [selectedStat, ...all.filter(name => name !== selectedStat)].slice(0,6) : all.slice(0,6);
  },[available,selectedStat]);
  const ordered = useMemo(()=>[...rows].reverse(),[rows]);
  const labels = ordered.map(row=>row.columns[0]?.text?.split(' ')[0] ?? 'Game');
  if(!rows.length)return <p className="text-sm theme-muted">No game logs to chart.</p>;
  return <section className="space-y-4">
    <div className="dashboard-panel p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Performance dashboard</h2><p className="mt-1 text-xs theme-muted">Compare up to six statistics across {rows.length} games. Select a metric to prioritize it.</p></div><select aria-label="Prioritize metric" value={selectedStat} onChange={e=>setSelectedStat(e.target.value)} className="rounded-lg border theme-border theme-surface-raised px-3 py-2 text-sm"><option value="">Default metrics</option>{available.map(h=><option key={h.index} value={h.text}>{h.text}</option>)}</select></div></div>
    {chosen.length === 0 && <div className="dashboard-panel p-4 text-sm theme-muted">No numeric statistics were found in this game log.</div>}
    <div className="grid gap-4 lg:grid-cols-2">{chosen.map((stat,index)=>{
      const column = headers.find(h=>h.text===stat);
      if(!column)return null;
      const values = ordered.map(r=>{const v=numeric(r.columns[column.index]?.text);return v ?? 0});
      const validValues = ordered.map(r=>numeric(r.columns[column.index]?.text)).filter((v):v is number=>v !== null);
      const avg = validValues.length ? validValues.reduce((a,b)=>a+b,0)/validValues.length : 0;
      const max = Math.max(...values);
      const min = Math.min(...values);
      const data = {labels,datasets:[{type:'bar' as const,label:stat,data:values,backgroundColor:index===0?'rgba(139,92,246,.65)':'rgba(45,190,180,.55)',borderColor:index===0?'rgba(167,139,250,1)':'rgba(45,190,180,1)',borderWidth:1,borderRadius:4},{type:'line' as const,label:'Average',data:values.map(()=>avg),borderColor:'rgba(234,205,85,.9)',backgroundColor:'rgba(234,205,85,.9)',pointRadius:0,borderWidth:2}]};
      return <article key={stat} className="dashboard-panel min-w-0 rounded-xl p-4"><div className="mb-3 flex items-center justify-between gap-2"><div><h3 className="font-semibold">{stat}</h3><p className="text-xs theme-muted">Average {avg.toFixed(1)} · Range {min}–{max}</p></div><span className="rounded-full border theme-border px-2 py-1 text-xs theme-muted">{values.length} games</span></div><div className="h-[235px]"><Chart type="bar" data={data} options={{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{callbacks:{title:items=>{const i=items[0]?.dataIndex;return i===undefined?'':ordered[i]?.columns[0]?.text||'';}}}},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:6,color:'#94a3b8'}},y:{beginAtZero:true,ticks:{color:'#94a3b8'},grid:{color:'rgba(148,163,184,.1)'}}}}}/></div></article>;
    })}</div>
  </section>;
}
