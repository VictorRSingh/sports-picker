"use client";
import SportDynamicClientPage from "@/components/sport/SportDynamicClientPage";
import React from "react";

export default function SportDynamicPage({
  params,
}: {
  params: Promise<{ sport: string; slug: string }>;
}) {
  const { sport, slug } = React.use(params);
  const sportLower = sport.toLowerCase();
  const supportedSports = ["nba", "nfl", "nhl", "mlb", "wnba"];

  if (!supportedSports.includes(sportLower)) {
    return <div>Sport not supported</div>;
  }

  return (
    <div className="flex lg:w-3/4 m-auto h-full w-full">
      <SportDynamicClientPage sport={sportLower} slug={slug} />
    </div>
  );
}
