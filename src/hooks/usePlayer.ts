import { DEBUG } from "@/config";
import { Player } from "@/interfaces/Player";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const usePlayer = (playerObject: Player, setPlayerObject: Dispatch<SetStateAction<Player>>) => {
  const [player, setPlayer] = useState<string>("");

  const fetchPlayer = async () => {
    const searchLink = `${DEBUG ? 'sportsPredictor/' : ''}api/foxsports/search?player=${player?.replace(" ", "%20")}`;

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
