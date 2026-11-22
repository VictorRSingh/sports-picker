import React from "react";
import GameDetail from "@/components/game/GameDetail";
export default async function GameDetailPage({params,searchParams}:{params:Promise<{sport:string}>;searchParams:Promise<{webUrl?:string}>}) {
 const {sport}=await params;const {webUrl}=await searchParams;
 if (!["nba","nfl","nhl","mlb","wnba"].includes(sport.toLowerCase())) return <main className="p-8">Unsupported sport</main>;
 return <GameDetail sport={sport.toLowerCase()} webUrl={webUrl ?? ""}/>;
}
