export type Market = 'points'|'rebounds'|'assists'|'pra'|'passing_yards'|'rushing_yards'|'receiving_yards'|'receptions'|'shots'|'saves';
export type Side='over'|'under';
export const markets:Record<string,{value:Market;label:string}[]>={
 nba:[{value:'points',label:'Points'},{value:'rebounds',label:'Rebounds'},{value:'assists',label:'Assists'},{value:'pra',label:'Points + rebounds + assists'}],
 nfl:[{value:'passing_yards',label:'Passing yards'},{value:'rushing_yards',label:'Rushing yards'},{value:'receiving_yards',label:'Receiving yards'},{value:'receptions',label:'Receptions'}],
 nhl:[{value:'shots',label:'Shots on goal'},{value:'saves',label:'Goalie saves'},{value:'points',label:'Points'}]
};
export function analyze(values:number[],line:number,side:Side,americanOdds:number){
 if(!values.length||values.some(x=>!Number.isFinite(x)||x<0)||!Number.isFinite(line)||line<0||!Number.isInteger(americanOdds)||Math.abs(americanOdds)<100)throw Error('Enter valid nonnegative game stats, a line, and American odds of at least +100 or -100.');
 const hits=values.filter(v=>side==='over'?v>line:v<line).length;
 const pushes=values.filter(v=>v===line).length;
 const average=values.reduce((a,b)=>a+b,0)/values.length;
 const implied=americanOdds<0?(-americanOdds)/(-americanOdds+100):100/(americanOdds+100);
 return {games:values.length,hits,pushes,losses:values.length-hits-pushes,hitRate:hits/values.length,average,median:[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)],impliedProbability:implied,min:Math.min(...values),max:Math.max(...values)};
}
