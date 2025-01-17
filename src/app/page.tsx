"use client";

import Hero from "@/components/main/Hero";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero
        heading="Sports props and matchups all in one convenient location"
        description="Find player props, stats as well as current matchups for NBA, NFL and NHL."
        buttons={[{ name: 'nba', path:`/nba`}, { name: 'nfl', path:'/nfl'}]}
      />
    </div>
  );
}
