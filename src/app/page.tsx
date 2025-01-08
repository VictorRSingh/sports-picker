"use client";

import PlayerGameLogs from "@/components/PlayerGameLogs";
import PlayerGraphs from "@/components/PlayerGraphs";
import PlayerGraphStatistics from "@/components/PlayerGraphStatistics";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerView from "@/components/PlayerView";
import usePlayer from "@/hooks/usePlayer";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import { useEffect, useState } from "react";

export default function Home() {
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [playerObject, setPlayerObject] = useState<Player>();

  return (
    <div className="flex flex-col md:flex-row max-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col items-center gap-y-4 md:w-1/3 border-b-2 md:border-r-2 md:border-b-0 p-4">
        <PlayerSearch
          playerObject={playerObject as Player}
          setPlayerObject={setPlayerObject}
        />
        {playerObject && <PlayerView playerData={playerObject} />}

        {gameLogs.length > 0 && playerObject && <PlayerGraphStatistics playerObject={playerObject}  gameLogs={gameLogs} />}
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-auto md:w-2/3">
        {playerObject && (
          <div className="w-full overflow-x-auto text-sm max-h-[100%]">
            <PlayerGameLogs playerObject={playerObject} setGameLog={setGameLogs} />
          </div>
        )}
      </div>
    </div>
  ); 
}
