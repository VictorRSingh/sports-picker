"use client";

import PlayerGameData from '@/components/PlayerGameData';
import PlayerGraphStatistics from '@/components/PlayerGraphStatistics';
import PlayerSearch from '@/components/PlayerSearch';
import PlayerView from '@/components/PlayerView';
import { GameLog } from '@/interfaces/GameLog';
import { Player } from '@/interfaces/Player'
import React, { useState } from 'react'

const search = () => {
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [player, setPlayer] = useState<Player | null>(null);
    return (
      <div className="flex flex-col w-full md:px-[25%]">
        {/* Sidebar */}
        <div className="flex flex-col items-center">
          <PlayerSearch player={player} setPlayer={setPlayer} />
          {player && <PlayerView playerData={player} />}
  
          {gameLogs.length > 0 && player && (
            <PlayerGraphStatistics player={player} gameLogs={gameLogs} />
          )}
        </div>
  
        {/* Main Content */}
        <div className="flex flex-grow overflow-auto">
          {player && (
            <>
              {player.sport === "nba" || player.sport === "nfl" ? (
                <div className="w-full overflow-x-auto text-sm max-h-[100%]">
                  <PlayerGameData
                    player={player}
                    gameLogs={gameLogs}
                    setGameLogs={setGameLogs}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center">Sport not supported.</div>
              )}
            </>
          )}
        </div>
      </div>
  )
}

export default search