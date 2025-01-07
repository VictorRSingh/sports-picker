import { Player } from "@/interfaces/Player";
import React from "react";

interface PlayerViewProps {
  playerData: Player;
}

const PlayerView: React.FC<PlayerViewProps> = ({ playerData }) => {
  return (
    <div className="flex items-center w-full justify-between">
      <img
        className="w-28 border rounded-full bg-white"
        src={playerData.image}
      />
      <div className="text-end">
        <h1 className="font-bold text-xl">{playerData.name}</h1>
        <p className="text-xs text-gray-300">{playerData.team}</p>
        <p className="text-xs text-gray-300 font-semibold">
          {playerData.position}
        </p>
      </div>
    </div>
  );
};

export default PlayerView;
