import { Stat } from "@/types/Stat";
import React from "react";

interface PlayerStatProps {
  stat: Stat;
}

const PlayerStat = ({ stat }: PlayerStatProps) => {
  return (
    <div className="flex flex-col p-4 border-b border-gray-700">
      <h1 className="text-xs font-semibold">{stat.name}</h1>
      <div className="flex items-center gap-x-4">
        <h1 className="text-3xl">{stat.value}</h1>
        <div className="flex flex-col text-xs text-gray-400">
          <p className="">{stat.abbr}</p>
          <p className="">{stat.ranking}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStat;
