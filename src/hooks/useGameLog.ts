import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import axios from "axios";
import React, { useState } from "react";

interface useGameLogProps {
  playerObject: Player;
}

const useGameLog = (gameLogProps: useGameLogProps) => {
  const [gamelog, setGameLog] = useState<GameLog[]>();
  const webUrl = gameLogProps.playerObject.webUrl;

  const searchLink = `sportsPredictor/api/foxsports/player/gamelogs?webUrl=${webUrl}`;

  const fetchGameLog = async () => {
    try {
      const response = await axios.get(searchLink);
      const data = await response.data;

      setGameLog(data);
    } catch (error) {
      console.error("Error fetching game log:", error);
    }
  };

  return { gamelog, setGameLog, fetchGameLog };
};

export default useGameLog;
