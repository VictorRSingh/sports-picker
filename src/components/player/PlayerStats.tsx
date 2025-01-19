import { Player } from "@/types/Player";
import React from "react";
import PlayerStat from "./PlayerStat";
import PlayerHeader from "./PlayerHeader";

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats = ({ player }: PlayerStatsProps) => {
  return (
    <div className="">
      {player && player.stats?.map((stat, index) => (
              <PlayerStat  key={`${stat.name}-${index}`} stat={stat} />
          ))}
    </div>
  );
};

export default PlayerStats;
