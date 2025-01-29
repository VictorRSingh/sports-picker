"use client";

import GamePreview from "@/components/game/GamePreview";
import RosterPreview from "@/components/game/RosterPreview";
import { useGame } from "@/hooks/useGame";
import { useRoster } from "@/hooks/useRoster";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameUrl = params.game;
  const awayTeam = searchParams.get("away");
  const homeTeam = searchParams.get("home");
  const sport = searchParams.get("sport");

  const awayRoster = awayTeam ? useRoster(awayTeam) : null;
  const homeRoster = homeTeam ? useRoster(homeTeam) : null;

  console.log(awayRoster);
  console.log(homeRoster);

  const { game } = useGame(sport as string, gameUrl as string);

  console.log(game);

  return (
    <div className="w-full lg:px-20">
      {game && (
        <>
          <GamePreview game={game} />
          {awayRoster && homeRoster && (
            <div className="flex flex-col lg:flex-row gap-y-4 w-full gap-x-4">
              <div className="flex flex-col w-full">
                <h1 className="text-lg font-bold mb-2">{`Away Team (${awayRoster.playerCount})`}</h1>
                <RosterPreview roster={awayRoster} />
              </div>
              <div className="flex flex-col w-full">
                <h1 className="text-lg font-bold mb-2">{`Home Team (${homeRoster.playerCount})`}</h1>
                <RosterPreview roster={homeRoster} />
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;
