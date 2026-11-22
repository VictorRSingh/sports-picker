import type { Gamelog } from '@/types/Gamelog';
import type { Market } from '@/lib/betting';

const aliases: Record<Market,string[][]> = {
  points:[['PTS']], rebounds:[['REB']], assists:[['AST']], pra:[['PTS'],['REB'],['AST']],
  passing_yards:[['PASS YDS','PASS YARDS','PYDS','YDS PASS']],
  rushing_yards:[['RUSH YDS','RUSH YARDS','RYDS']],
  receiving_yards:[['REC YDS','RECEIVING YDS','RECEIVING YARDS','RECYDS']],
  receptions:[['REC','RECEPTIONS']], shots:[['SOG','SHOTS','SHOTS ON GOAL']],
  saves:[['SV','SAVES']]
};
const normalize=(s:string)=>s.trim().toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
export function extractPlayerMarketLogs(log:Gamelog|undefined,market:Market) {
 if(!log?.headers?.columns?.length||!log.rows?.length) return {values:[] as number[],dates:[] as string[],error:'No game logs available.'};
 const headers=log.headers.columns.map(c=>normalize(c.text));
 const indices=aliases[market].map(group=>headers.findIndex(h=>group.some(a=>normalize(a)===h)));
 if(indices.some(i=>i<0)) return {values:[] as number[],dates:[] as string[],error:`This game log does not include all statistics needed for ${market.replaceAll('_',' ')}.`};
 const values:number[]=[];const dates:string[]=[];
 for(const row of log.rows){
  const nums=indices.map(i=>Number(row.columns[i]?.text?.trim()));
  if(nums.some((n,j)=>!Number.isFinite(n)||n<0||!row.columns[indices[j]]?.text?.trim()||!/^\d+(?:\.\d+)?$/.test(row.columns[indices[j]].text.trim())))continue;
  values.push(nums.reduce((a,b)=>a+b,0));dates.push(row.columns[0]?.text||`Game ${values.length}`);
 }
 return {values,dates,error:values.length?'':'No numeric game results were available for this market.'};
}
