// hooks/useSchedule.ts
import { useEffect, useState } from "react";
import { Standing } from "@/types/Standing";
export function useStandings(sport: string): Standing | null {
  const [standings, setStandings] = useState<Standing | null>(null);
    if (!sport) {
        return null; // Return null if sport is not provided
    }
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch(
          `/api/foxsports/${sport}/standings?sport=${sport}`
        );
        const data = await res.json();
        setStandings(data); // Make sure this matches expected shape: { division: "", headers: { columns: [] }, rows: [] }
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, [sport]);

  return standings;
}
