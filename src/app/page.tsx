"use client";

import Hero from "@/components/main/Hero";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero
        heading="Curated player props and stats for major league sports"
        description="Easily find key players and identify value picks for current games across 
        supported major league sports such as NBA, NFL, NHL and MLB."
      />
    </div>
  );
}
