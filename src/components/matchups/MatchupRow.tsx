import { Game } from "@/types/Game";
import React from "react";

interface MatchupRowProps {
  team: Game["teams"]["awayTeam"]["name"] | Game["teams"]["homeTeam"]["name"];
}

const MatchupRow = ({ team }: MatchupRowProps) => {
  return (
    <div className="col-span-1">
      <span className="text-lg font-semibold">{team}</span>
    </div>
  );
};

export default MatchupRow;
