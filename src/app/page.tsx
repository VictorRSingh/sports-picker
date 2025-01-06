"use client";

import PlayerGameLogs from "@/components/PlayerGameLogs";
import PlayerGraphs from "@/components/PlayerGraphs";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerView from "@/components/PlayerView";
import usePlayer from "@/hooks/usePlayer";
import { Player } from "@/interfaces/Player";
import { useEffect, useState } from "react";

export default function Home() {
  const { player, setPlayer, fetchPlayer, playerObject } = usePlayer();
  const [foundPlayer, setFoundPlayer] = useState<Player>();

  useEffect(() => {
    if(playerObject) {
      setFoundPlayer(playerObject);
    }
  }, [playerObject])

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <PlayerSearch
        player={player}
        setPlayer={setPlayer}
        fetchPlayer={fetchPlayer}
      />
      {playerObject && (
        <div className="">
          <PlayerView playerData={playerObject} />
          <div className="w-full">
            <PlayerGameLogs playerObject={playerObject} />
          </div>
        </div>
      )}
    </div>
  );
}
