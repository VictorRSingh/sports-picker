import { Player } from "@/interfaces/Player";
import axios from "axios";
import { useState } from "react";

const usePlayer = () => {
  const [player, setPlayer] = useState<string>("");
  const [playerObject, setPlayerObject] = useState<Player>();
  const fetchPlayer = async () => {
    try {
      const response = await axios.get(
        `sportsPredictor/api/foxsports/search?player=${player?.replace(" ", "%20")}`
      );
      const data = await response.data;
      setPlayerObject(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  return { player, setPlayer, fetchPlayer, playerObject, setPlayerObject };
};

export default usePlayer;
