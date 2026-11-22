// /app/[sport]/page.tsx
"use client";
import StandingsCard from "@/components/standings/StandingsCard";
import { Standing } from "@/types/Standing";
import SportHomeView from "@/views/SportHomeView";

import React from "react";

export default function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = React.use(params);
  const sportLower = sport.toLowerCase();
  const supportedSports = ["nba", "nfl", "nhl", "mlb", "wnba"];

  if (!supportedSports.includes(sportLower)) {
    return <div>Sport not supported</div>;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <>
        <SportHomeView sport={sportLower} />
      </>
    </div>
  );
}
