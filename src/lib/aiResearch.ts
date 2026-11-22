export type ResearchSection = {key: 'support'|'counter'|'missing'|'conclusion'; title: string; text: string};
const definitions = [
 {key:'support',title:'Supporting evidence',pattern:/supporting\s+evidence|supporting\s+factors/i},
 {key:'counter',title:'Counter-evidence',pattern:/counter[\s-]*evidence|risks|limitations/i},
 {key:'missing',title:'Missing information',pattern:/missing\s+information|unknowns|additional\s+information/i},
 {key:'conclusion',title:'Conclusion',pattern:/conclusion|overall\s+assessment|summary/i},
] as const;
function clean(text:string){return text.replace(/\*\*/g,'').replace(/^#+\s*/gm,'').trim();}
export function parseResearch(raw:string):{sections:ResearchSection[];fallback:string}{
 const input=raw.trim();
 try{
  const obj=JSON.parse(input.replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,'')) as Record<string,unknown>;
  const sections=definitions.flatMap(d=>{
   const value=obj[d.key]??obj[d.key==='support'?'supportingEvidence':d.key==='counter'?'counterEvidence':d.key==='missing'?'missingInformation':'conclusion'];
   const t=Array.isArray(value)?value.filter(x=>typeof x==='string').join('\n'):typeof value==='string'?value:'';
   return t?[{key:d.key,title:d.title,text:clean(t)}]:[];
  });
  if(sections.length>=2)return {sections,fallback:''};
 }catch{}
 const parts:Partial<Record<ResearchSection['key'],string[]>>={};let current:ResearchSection['key']|undefined;
 for(const line of input.split(/\r?\n/)){
  const trimmed=line.trim();
  const match=definitions.find(d=>d.pattern.test(trimmed.replace(/^[#*\s-]+/,'').replace(/[:*\s]+$/,'')) && trimmed.length<90);
  if(match){current=match.key;parts[current]??=[];const after=trimmed.replace(/^[#*\s-]+/,'').replace(/^.*?:\s*/, '');if(after!==trimmed&&after&&!match.pattern.test(after))parts[current]!.push(after);continue;}
  if(current&&trimmed)parts[current]!.push(line);
 }
 const sections=definitions.flatMap(d=>parts[d.key]?.length?[{key:d.key,title:d.title,text:clean(parts[d.key]!.join('\n'))}]:[]);
 return sections.length>=2?{sections,fallback:''}:{sections:[],fallback:input};
}
