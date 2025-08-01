// /app/[sport]/[slug]/page.tsx
import SportDynamicClientPage from "@/components/sport/SportDynamicClientPage";
import React from "react";

export default async function SportDynamicPage({
  params,
}: {
  params: Promise<{ sport: string; slug: string }>;
}) {
  const { sport, slug } = await params;
  const sportLower = sport.toLowerCase();

  const supportedSports = ["nba", "nfl", "nhl", "mlb", "wnba"];
  if (!supportedSports.includes(sportLower)) {
    return <div>Unsupported sport</div>;
  }

  return (
    <div className="flex lg:w-3/4 m-auto h-full w-full">
      <SportDynamicClientPage sport={sportLower} slug={slug} />
    </div>
  );
}
