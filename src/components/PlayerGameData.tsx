import useGameLog from "@/hooks/useGameLog";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PlayerGameLogs from "./PlayerGameLogs";
import PlayerGraphDisplay from "./PlayerGraphDisplay";

interface PlayerGameLogsProps {
  player: Player | null;
  gameLogs: GameLog[];
  setGameLogs: Dispatch<SetStateAction<GameLog[]>>;
}

const PlayerGameData = ({ player, gameLogs, setGameLogs}: PlayerGameLogsProps) => {
  const { fetchGameLog } = useGameLog(player, gameLogs, setGameLogs);

  useEffect(() => {
    if (player) {
      fetchGameLog();
    }
  }, [player]);

  return (
    <div className="p-4 flex flex-col">
      {gameLogs.length} Games found for {player && player.name}
      <PlayerGameLogs player={player} gameLogs={gameLogs} />
      <PlayerGraphDisplay player={player} gameLogs={[...gameLogs].reverse()} />
    </div>
  );
};

export default PlayerGameData;
