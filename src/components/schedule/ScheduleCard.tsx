import React, { useEffect, useState } from "react";

import GameCard from "@/components/schedule/GameCard";
import { useSchedule } from "@/hooks/useSchedule";
import { Game } from "@/types/Game";
import GamePreview from "../game/GamePreview";
import { Schedule } from "@/types/Schedule";

type ScheduleCardProps = {
  sport: string;
};
const ScheduleCard = ({ sport }: ScheduleCardProps) => {
  const schedule: Schedule | null = useSchedule(sport);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    if (Array.isArray(schedule) && schedule.length > 0) {
      setSelectedGame(schedule[0]);
    }
  }, [schedule]);

  if (schedule?.success === false) {
    return (
      <div className="flex items-center justify-center my-8 font-bold text-2xl">
        No Schedule Available
      </div>
    );
  } 

  return (
    <div className="md:flex w-full flex-col">
      {Array.isArray(schedule) ? (
        <div className="h-full">
          <h1 className="text-2xl font-bold">
            Schedule for {sport.toUpperCase()}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 p-2">
            <div className="col-span-1 space-y-4">
              {schedule.map((game: Game, index: number) => (
                <div key={index} className="" onClick={() => {
                  console.log("Game clicked:", game);
                  
                  if(selectedGame?.id === game.id) {
                    setSelectedGame(null);
                  } else {
                    setSelectedGame(game);
                  }
                }}>
                  <GameCard game={game} sport={sport} />
                  {selectedGame?.id && game?.id == selectedGame?.id && (
                    <div className="col-span-full lg:hidden">
                      <GamePreview game={selectedGame} sport={sport} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedGame && (
              <div className="hidden lg:block lg:col-span-2 lg:pl-4">
                <GamePreview key={selectedGame.id} game={selectedGame} sport={sport} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading schedule...</p>
      )}
    </div>
  );
};

export default ScheduleCard;
