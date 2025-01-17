"use client";

import MatchupSheet from "@/components/matchups/MatchupSheet";
import { useMatchup } from "@/hooks/useMatchup";
import React from "react";

const NBA = () => {
  const { matchups } = useMatchup("nba");

  return (
    <div className="flex w-full h-full">
      <MatchupSheet matchups={matchups} />
    </div>
  );
};

export default NBA;
