import { DEBUG } from "@/config";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";

const useGameLog = (
  player: Player | null,
  gameLogs: GameLog[],
  setGameLogs: Dispatch<SetStateAction<GameLog[]>>
) => {
  const webUrl = player ? player.webUrl : null;

  const searchLink = `${
    DEBUG ? "sportsPicker/" : ""
  }api/foxsports/player/gamelogs?webUrl=${webUrl}`;

  const fetchGameLog = async () => {
    if (webUrl) {
      try {
        const response = await axios.get(searchLink);
        const data = await response.data;
  
        // Avoid unnecessary state updates
        if (JSON.stringify(data) !== JSON.stringify(gameLogs)) {
          setGameLogs(data);
        }
      } catch (error) {
        console.error("Error fetching game log:", error);
      }
    }
  };
  

  return { fetchGameLog };
};

export default useGameLog;
