import { Player } from "@/interfaces/Player";
import React from "react";

interface PlayerViewProps {
    playerData: Player;
}

const PlayerView: React.FC<PlayerViewProps> = ({playerData}) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-xl">{playerData.name}</h1>
      <p className="text-xs text-gray-300">{playerData.team}</p>
      <img className="w-28 border rounded-full" src={playerData.image} />
    </div>
  );
};

export default PlayerView;
