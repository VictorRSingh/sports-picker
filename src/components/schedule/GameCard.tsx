import { Game } from "@/types/Game";
import React from "react";
import { useRouter } from "next/navigation";

type GameCardProps = {
  // Define the props for GameCard if needed
  game: Game;
};

const GameCard = ({ game }: GameCardProps) => {
  const router = useRouter();

  return (
    <div
      className="space-y-2 cursor-pointer"
      onClick={() => router.push(`${game.webUrl}`)}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 text-end">{game.date}</div>
        <div className="text-sm text-gray-500 text-end">{game.status}</div>
      </div>
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex flex-col space-y-2">
          <div className="flex">
            <img
              src={game.teams.awayTeam.logo}
              alt={`${game.teams.awayTeam.name} logo`}
              className="w-8 h-8 mr-2"
            />
            <span>{game.teams.awayTeam.name} @</span>
          </div>
          <div className="flex">
            <img
              src={game.teams.homeTeam.logo}
              alt={`${game.teams.homeTeam.name} logo`}
              className="w-8 h-8 mr-2"
            />
            <span>{game.teams.homeTeam.name}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">{game.location.city}</div>
        <div className="text-sm text-gray-500 text-end">{game.location.stadium}</div>
      </div>
    </div>
  );
};

export default GameCard;
