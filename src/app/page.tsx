"use client";

import PlayerGameData from "@/components/PlayerGameData";
import PlayerGraphStatistics from "@/components/PlayerGraphStatistics";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerView from "@/components/PlayerView";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import { useState } from "react";

export default function Home() {
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  return (
    <div className="flex flex-col md:flex-row max-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col items-center gap-y-4 md:w-1/3 border-b-2 md:border-r-2 md:border-b-0 p-4">
        <PlayerSearch
        player={player}
        setPlayer={setPlayer}
        />
        {player && <PlayerView playerData={player} />}

        {gameLogs.length > 0 && player && <PlayerGraphStatistics playerObject={player}  gameLogs={gameLogs} />}
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-auto md:w-2/3">
        {player && (
          <div className="w-full overflow-x-auto text-sm max-h-[100%]">
            <PlayerGameData player={player} gameLogs={gameLogs} setGameLogs={setGameLogs} />
          </div>
        )}
      </div>
    </div>
  ); 
}
