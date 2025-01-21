import { Gamelog } from "@/types/Gamelog";
import { Player } from "@/types/Player";
import axios from "axios";
import { useEffect, useState } from "react";

export function useGameLog(player: Player) {
    const [gameLogs, setGameLog] = useState<Gamelog>();

    const fetchGameLog = async () => {
        try {
            if(!player) {
                return;
            }

            const response = await axios.get(`/api/foxsports/players/gamelogs?playerUrl=${player.webUrl}`);
            const data = await response.data;

            if(data) {
                console.log("Gamelog", data);
                setGameLog(data);
            }

        } catch (error) {
            console.error("Failed to fetch gamelog", error);
        }
    }

    useEffect(() => {
        fetchGameLog();
    }, [player])

    return { gameLogs }; 
}   