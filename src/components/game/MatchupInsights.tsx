"use client";
import {useEffect,useState} from "react";
import {useGame} from "@/hooks/useGame";
import {parseResearch} from "@/lib/aiResearch";
import Link from "next/link";
import {playerProfileHref} from "@/lib/playerProfileLink";

type Tab="players"|"trends"|"analysis";
type Stat={abbr?:string;name?:string;value?:string|number};
function PlayerName({name,url,sport,team}:{name?:string;url?:string;sport:string;team?:string}) {
 const direct=playerProfileHref(sport,url);
 const [resolved,setResolved]=useState<string|null>(null);
 useEffect(()=>{
  setResolved(null);
  if(direct||!name||!team||name==="Player not available")return;
  const controller=new AbortController();
  fetch(`/api/foxsports/resolve-player?${new URLSearchParams({name,sport,team})}`,{signal:controller.signal})
   .then(r=>r.ok?r.json():null)
   .then(data=>{if(!controller.signal.aborted)setResolved(typeof data?.href==="string"?data.href:null);})
   .catch(()=>{});
  return ()=>controller.abort();
 },[name,sport,url,team,direct]);
 if(!name)return null;
 const href=direct||resolved;
 return href?<Link href={href} className="font-semibold hover:underline focus-visible:underline" title={`View ${name}'s Sports Picker profile`}>{name}</Link>:<span className="font-semibold">{name}</span>;
}
function PlayerCard({player,label,sport}:{player:any;label:string;sport:string}){
 return <div className="rounded-xl border theme-border theme-surface-raised p-4"><p className="mb-3 text-xs uppercase theme-muted">{label}</p><div className="flex items-center gap-3">{player?.image?<img src={player.image} alt="" className="h-14 w-14 rounded-full object-cover"/>:<div className="h-14 w-14 rounded-full theme-surface"/>}<div><p><PlayerName name={player?.name||"Player not available"} url={player?.webUrl} sport={sport} team={label}/></p><p className="mt-1 text-xs theme-muted">{Array.isArray(player?.stats)?player.stats.slice(0,5).join(" · "):"No verified player stats available"}</p></div></div></div>
}
export default function MatchupInsights({sport,webUrl,tab}:{sport:string;webUrl:string;tab:Tab}){
 const {game,loading,error}=useGame(sport,webUrl);
 const [provider,setProvider]=useState<"gemini"|"ollama">("ollama");
 const [result,setResult]=useState("");const [aiError,setAiError]=useState("");const [busy,setBusy]=useState(false);
 if(loading)return <div className="dashboard-panel p-6 text-sm theme-muted">Loading verified matchup data…</div>;
 if(error||!game)return <div className="dashboard-panel p-6 text-sm theme-muted">{error||"No matchup data available."}</div>;
 const pairing=game.featuredPairing;
 const leaders=game.teamLeadersComparison;
 const stats=game.teamStatsComparison;
 const away=stats?.awayTeam,home=stats?.homeTeam;
 const awayStats:Stat[]=away?.stats||[],homeStats:Stat[]=home?.stats||[];
 const sections=result?parseResearch(result):null;
 async function analyze(){setBusy(true);setAiError("");setResult("");try{const r=await fetch("/api/ai/matchup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sport,provider,matchup:{away:away?.name||"Away",home:home?.name||"Home",teamStats:stats,leaders,featuredPlayers:pairing}})});const data=await r.json();if(!r.ok)throw new Error(data.error||`Request failed (${r.status})`);setResult(data.analysis||"No analysis returned.");}catch(e){setAiError(e instanceof Error?e.message:"Analysis failed");}finally{setBusy(false)}}
 return <div className="dashboard-panel space-y-4 p-4 sm:p-5">
 {tab==="players"&&<><div><h3 className="text-base font-semibold">Matchup player insights</h3><p className="mt-1 text-xs theme-muted">Player information provided by the matchup feed. Pregame leaderboards may be unavailable.</p></div><div className="grid gap-3 sm:grid-cols-2"><PlayerCard player={pairing?.awayPlayer} label={away?.name||"Away"} sport={sport}/><PlayerCard player={pairing?.homePlayer} label={home?.name||"Home"} sport={sport}/></div><h4 className="text-sm font-semibold">Team leaders</h4>{(leaders?.awayTeam?.stats?.length||leaders?.homeTeam?.stats?.length)?<div className="space-y-2">{(leaders?.awayTeam?.stats||[]).map((s:Stat,i:number)=><div key={i} className="grid grid-cols-[1fr_90px_1fr] gap-2 border-b theme-border py-2 text-xs"><div className="text-right"><strong>{s.value??"—"}</strong><div className="theme-muted"><PlayerName name={s.name} url={(s as Stat & {webUrl?:string}).webUrl} sport={sport} team={leaders?.awayTeam?.name||away?.name}/></div></div><div className="text-center theme-muted">{s.abbr}</div><div><strong>{leaders?.homeTeam?.stats?.[i]?.value??"—"}</strong><div className="theme-muted"><PlayerName name={leaders?.homeTeam?.stats?.[i]?.name} url={leaders?.homeTeam?.stats?.[i]?.webUrl} sport={sport} team={leaders?.homeTeam?.name||home?.name}/></div></div></div>)}</div>:<p className="text-sm theme-muted">No verified player leader statistics for this matchup yet.</p>}</>}
 {tab==="trends"&&<><h3 className="text-base font-semibold">Team performance profile</h3><p className="text-xs theme-muted">These are available team comparison statistics, not recent-game trends. Last-five and last-ten charts require dated game history.</p>{awayStats.length?<div className="space-y-4">{awayStats.map((s,i)=>{const other=homeStats[i];const a=Number(s.value),b=Number(other?.value);const valid=Number.isFinite(a)&&Number.isFinite(b)&&a>=0&&b>=0;const max=Math.max(a,b,1);return <div key={i} className="rounded-lg border theme-border p-3"><p className="mb-3 text-xs font-semibold uppercase theme-muted">{s.name||s.abbr||`Metric ${i+1}`}</p><div className="grid grid-cols-[85px_1fr_55px] items-center gap-2 text-xs"><span className="truncate" title={away?.name}>{away?.name||"Away"}</span><div className="h-2 overflow-hidden rounded-full theme-surface-raised">{valid&&<div className="h-full rounded-full bg-teal-500" style={{width:`${100*a/max}%`}}/>}</div><strong className="text-right">{s.value??"—"}</strong><span className="truncate" title={home?.name}>{home?.name||"Home"}</span><div className="h-2 overflow-hidden rounded-full theme-surface-raised">{valid&&<div className="h-full rounded-full bg-violet-500" style={{width:`${100*b/max}%`}}/>}</div><strong className="text-right">{other?.value??"—"}</strong></div></div>})}</div>:<p className="text-sm theme-muted">No verified team statistics are available.</p>}</>}
 {tab==="analysis"&&<><h3 className="text-base font-semibold">AI matchup research</h3><p className="text-xs theme-muted">Uses available matchup statistics only. It cannot verify injuries, news, or predict a reliable win probability.</p><div className="flex flex-wrap items-center gap-2"><label htmlFor="matchup-provider" className="text-xs theme-muted">AI provider</label><select id="matchup-provider" className="rounded-lg border theme-border theme-surface-raised px-3 py-2 text-sm" value={provider} onChange={e=>setProvider(e.target.value as "gemini"|"ollama")}><option value="ollama">Ollama (local)</option><option value="gemini">Gemini</option></select><button type="button" onClick={analyze} disabled={busy||!awayStats.length} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{busy?"Analyzing…":"✦ Analyze matchup"}</button></div>{!awayStats.length&&<p className="text-xs theme-muted">AI analysis requires verified team statistics.</p>}{aiError&&<p role="alert" className="text-sm text-red-400">{aiError}</p>}{sections?.sections.length?<div className="grid gap-3 md:grid-cols-2">{sections.sections.map(s=><div key={s.key} className="rounded-xl border theme-border theme-surface-raised p-4"><h4 className="mb-2 text-sm font-semibold">{s.title}</h4><p className="whitespace-pre-wrap text-sm leading-6 theme-muted">{s.text}</p></div>)}</div>:result?<div className="whitespace-pre-wrap rounded-lg border theme-border p-4 text-sm leading-6">{sections?.fallback||result}</div>:null}</>}
 </div>;
}
