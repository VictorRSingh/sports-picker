import { Player } from "@/types/Player";
import axios from "axios";
import { useEffect, useState } from "react";

export function usePlayer(playerUrl: string) {
    const [player, setPlayer] = useState<Player>();

    const fetchPlayer = async () => {
        try {
            if(!playerUrl) {
                return;
            }

            const response = await axios.get(`/api/foxsports/players?playerUrl=${playerUrl}`);
            const data = await response.data;

            if(data) {
                setPlayer(data);
            }

        } catch (error) {
            console.error("Failed to fetch player", error);
        }
    }

    useEffect(() => {
        fetchPlayer();
    }, [playerUrl])

    return { player };
}