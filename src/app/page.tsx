"use client";

import PlayerGameLogs from "@/components/PlayerGameLogs";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerView from "@/components/PlayerView";
import usePlayer from "@/hooks/usePlayer";

export default function Home() {
  const { player, setPlayer, fetchPlayer, playerObject } = usePlayer();

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
