"use client";

import { Roster } from "@/types/Roster";
import axios from "axios";
import { useEffect, useState } from "react";

export function useRoster(teamUrl: string | null) {
  const [roster, setRoster] = useState<Roster | null>(null);

  useEffect(() => {
    if (!teamUrl) return; // ✅ Prevent API calls for invalid teamUrl

    const fetchRoster = async () => {
      try {
        console.log(`Fetching roster for ${teamUrl}...`); // Debug log
        const response = await axios.get(`/api/foxsports/teams/roster?teamUrl=${teamUrl}`);
        setRoster(response.data);
      } catch (error) {
        console.error(`Error fetching roster for ${teamUrl}:`, error);
      }
    };

    fetchRoster();
  }, [teamUrl]);

  return roster;
}
