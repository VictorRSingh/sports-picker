import { Player } from "@/interfaces/Player";
import axios from "axios";
import { useState } from "react";
import { DEBUG } from "../config";
const usePlayer = () => {
  const [player, setPlayer] = useState<string>("");
  const [playerObject, setPlayerObject] = useState<Player>();

  const fetchPlayer = async () => {
    const searchLink = `${
      DEBUG === true ? "sportsPredictor" : ""
    }/api/foxsports/search?player=${player?.replace(" ", "%20")}`;

    console.log(searchLink)
    try {
<<<<<<< HEAD
      const response = await axios.get(
        `api/foxsports/search?player=${player?.replace(" ", "%20")}`
      );
=======
      const response = await axios.get(searchLink);
>>>>>>> f444e43389c1cffa625202d630a69015069e62c3
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
