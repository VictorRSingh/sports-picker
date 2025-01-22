import { Stat } from "@/types/Stat";
import { TeamStats } from "@/types/TeamStats";
import axios from "axios";
import { useState } from "react";

export function useTeamStats() {
    const [teamStats, setTeamStats] = useState<TeamStats>();

    const fetchTeamStats = async (sport: string) => {
        if(!sport) {
            return;
        }
        console.log("Sport", sport);
        const response = await axios.get(`/api/foxsports/teams/stats?sport=${sport}`);
        const data = await response.data;

        if(data) {
            setTeamStats(data);
        }
    }

    return {teamStats, fetchTeamStats};

}