"use client";

import Hero from "@/components/main/Hero";
import SearchBar from "@/components/navbar/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero
        heading="Sports props and matchups all in one convenient location"
        description="Find player props, stats as well as current matchups for NBA, NFL and NHL."
      />
    </div>
  );
}
