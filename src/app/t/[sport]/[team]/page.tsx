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

  console.log("Roster:", roster);
  console.log("Team Stats:", teamStats);

  return (
    <>
      {roster ? (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:w-full gap-8 mx-auto w-[90%]">
          <div className="col-span-1 border rounded-xl border-gray-600">
            <RosterPreview roster={roster} />
          </div>
          <div className="col-span-3 border rounded-xl border-gray-600">
            <StatsPreview teamStats={teamStats} />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default TeamPage;
