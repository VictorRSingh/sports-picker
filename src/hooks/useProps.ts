import { PlayerProps } from "@/types/PlayerProps";
import axios from "axios";
import { useEffect, useState } from "react";


export function useProps(query: string) {
    const [playerProps, setPlayerProps] = useState<PlayerProps[]>([]);

    const fetchPlayerProps = async () => {
        try {
            if(!query) {
                return;
            }
            const url = `/api/google/search?sport=${query.split("/")[1]}&player=${query.split("/")[2]}`;
            // Fatch Player link from google;
            const googleLink = await axios.get(url);
            const link = await googleLink.data;

            if(link) {
                const response = await axios.get(`/api/covers/props?url=${link}`)
                const data = await response.data;

                if(data) {
                    setPlayerProps(data);
                }
            }

        } catch (error) {
            console.error("Failed to fetch player props", error);
        }
    };

    useEffect(() => {
            fetchPlayerProps();
    }, [query])

    return { playerProps, fetchPlayerProps };

}