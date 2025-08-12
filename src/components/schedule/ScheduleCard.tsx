import React, { useState } from "react";

import GameCard from "@/components/schedule/GameCard";
import { useSchedule } from "@/hooks/useSchedule";
import { Schedule } from "@/types/Schedule";
import { Game } from "@/types/Game";
import RosterPreview from "../team/RosterPreview";

type ScheduleCardProps = {
  sport: string;
};
const ScheduleCard = ({ sport }: ScheduleCardProps) => {
  const schedule = useSchedule(sport);
  const [selectedGame, setSelectedGame] = useState();

  if (schedule?.success === false) {
    return (
      <div className="flex items-center justify-center my-8 font-bold text-2xl">
        No Schedule Available
      </div>
    );
  }

  return (
    <div className="flex w-full p-4">
      {Array.isArray(schedule) ? (
        <div className="w-full h-full">
          <h1 className="text-2xl font-bold">
            Schedule for {sport.toUpperCase()}
          </h1>
          <ul className={`grid grid-cols-1 gap-4 mt-4`}>
            {schedule.map((game: Game, index: number) => {
              return (
                <li
                  key={index}
                  className="p-2 border hover:border-gray-700 rounded-lg col-span-1 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <GameCard game={game} sport={sport} />
                  
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>Loading schedule...</p>
      )}
    </div>
  );
};

export default ScheduleCard;
