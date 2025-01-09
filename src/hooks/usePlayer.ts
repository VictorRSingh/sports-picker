import { DEBUG } from "@/config";
import { Player } from "@/interfaces/Player";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const usePlayer = (
  playerQuery: string,
  setPlayer: Dispatch<SetStateAction<Player | null>>
) => {
  const fetchPlayer = async () => {
    const searchLink = `${
      DEBUG ? "sportsPicker/" : ""
    }api/foxsports/search?player=${playerQuery?.replace(" ", "%20")}`;

    console.log(searchLink);
    try {
      const response = await axios.get(searchLink);
      const data = await response.data;
      console.log(data);
      setPlayer(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  return { fetchPlayer };
};

export default usePlayer;
