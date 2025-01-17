import { Game } from "@/types/Game";
import axios from "axios";
import { useEffect, useState } from "react";

export function useMatchup(sport: string) {
    const [matchups, setMatchups] = useState<Game[]>([]);

    const fetchGames = async () => {
      const response = await axios.get(`/api/foxsports/odds?sport=${sport}`);
      const data = response.data;
  
      if(data) {
          setMatchups(data);
      }
    }
  
    useEffect(() => {
      fetchGames();
    }, [])
  
    return {matchups};
}