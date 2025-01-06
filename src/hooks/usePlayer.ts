import { Player } from "@/interfaces/Player";
import axios from "axios";
import { useState } from "react";
import { DEBUG } from "../config";
const usePlayer = () => {
  const [player, setPlayer] = useState<string>("");
  const [playerObject, setPlayerObject] = useState<Player>();

  const fetchPlayer = async () => {
    const searchLink = `sportsPredictor/api/foxsports/search?player=${player?.replace(" ", "%20")}`;

    console.log(searchLink)
    try {
      const response = await axios.get(searchLink);
      const data = await response.data;
      console.log(data);
      setPlayerObject(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  return { player, setPlayer, fetchPlayer, playerObject, setPlayerObject };
};

export default usePlayer;
