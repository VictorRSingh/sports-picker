"use client";

import { Team } from "@/types/Team";
import axios from "axios";
import { useEffect, useState } from "react";

export function useTeam(sport: string) {
  const [teams, setTeams] = useState<Team[]>();

  const fetchTeams = async () => {
    const response = await axios.get(`/api/foxsports/teams?sport=${sport}`);
    const data = response.data;

    if (data) {
      setTeams(data);
    }
  };

  useEffect(() => {
    if (sport) {
      fetchTeams();
    }
  }, []);

  return { teams, fetchTeams };
}
