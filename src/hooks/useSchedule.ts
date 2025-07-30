// hooks/useSchedule.ts
import { Schedule } from "@/types/Schedule";
import { useEffect, useState } from "react";

export function useSchedule(sport: string): Schedule | null {
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/foxsports/${sport}/schedule?sport=${sport}`);
        const data = await res.json();
        setSchedule(data); // Make sure this matches expected shape: { games: [...] }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [sport]);

  return schedule;
}
