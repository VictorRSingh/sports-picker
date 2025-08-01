"use client";

import { useRoster } from "@/hooks/useRoster";
import React from "react";
import { useParams } from "next/navigation";
import RosterPreview from "@/components/team/RosterPreview";
import { useTeamStats } from "@/hooks/useTeamStats";
import StatsPreview from "@/components/team/StatsPreview";
const TeamPage = () => {
  const params = useParams();

  const teamUrl = params.team as string;
  const sport = params.sport as string;
  const roster = useRoster(`/${sport}/${teamUrl}`);
  const teamStats = useTeamStats(sport, teamUrl);

  console.log("Team Stats:", teamStats);

  return (
    <>
      {roster ? (
        <div className="flex flex-col w-full h-full">
          <RosterPreview roster={roster} />
          <StatsPreview teamStats={teamStats} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default TeamPage;
