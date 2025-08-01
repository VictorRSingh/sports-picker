import { TeamStats } from "@/types/TeamStats";
import { useEffect, useState } from "react";

export function useTeamStats(sport: string, teamUrl: string): TeamStats[] | null {
  const [teamStats, setTeamStats] = useState<TeamStats[] | null>(null);

  if (!sport || !teamUrl) {
    return null; // Return empty object if sport or team is not provided
  }

  useEffect(() => {
    try {
        const fetchTeamStats = async () => {
          const res = await fetch(`/api/foxsports/teams/stats?teamUrl=${teamUrl}&sport=${sport}`);
          const data = await res.json();
          setTeamStats(data);
        };

        fetchTeamStats();
    } catch (error) {
        console.error("Error fetching team stats:", error);
    }
  }, [sport, teamUrl]);

  return teamStats;
}
