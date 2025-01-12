import { DEBUG } from "@/config";
import { GameLog } from "@/interfaces/GameLog";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const useGameLog = (player: string | null) => {
  const [gameLogs, setGameLogs] = useState<GameLog>();

  useEffect(() => {
    if (!player) return;

    const fetchGameLog = async () => {
      const searchLink = `/api/foxsports/player/gamelogs?webUrl=${player}`;
      console.log(searchLink);
    
      try {
        const response = await axios.get(searchLink);
        setGameLogs(response.data);
      } catch (error) {
        console.error("Error fetching game log", error);
      }
    }

    fetchGameLog();
  }, [player]);

  return { gameLogs };
};

export default useGameLog;
