import { GameLog } from "@/interfaces/GameLog";
import { calculateDeviation } from "@/utils/statistics/nba/calculateDeviation";
import {
  getPlayerAssistsAverage,
  getPlayerPointAverage,
  getPlayerReboundAverage,
} from "@/utils/statistics/nba/getPlayerAverages";
import React from "react";

interface NBAStatisticsProps {
  gameLogs: GameLog[];
}

const NBAStatistics: React.FC<NBAStatisticsProps> = ({ gameLogs }) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col">
        <h1>
          Player Point Average: {getPlayerPointAverage(gameLogs).toFixed(1)}
        </h1>
        <h1>
          Player Rebounds Average:{" "}
          {getPlayerReboundAverage(gameLogs).toFixed(1)}
        </h1>
        <h1>
          Player Assists Average: {getPlayerAssistsAverage(gameLogs).toFixed(1)}
        </h1>
      </div>
    </div>
  );
};

export default NBAStatistics;
