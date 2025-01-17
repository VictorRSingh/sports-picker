"use client";

import MatchupSheet from "@/components/matchups/MatchupSheet";
import { useMatchup } from "@/hooks/useMatchup";
import React from "react";

const NFL = () => {
  const { matchups } = useMatchup("nfl");

  console.log(matchups);
  return (
    <MatchupSheet matchups={matchups} />
  );
};

export default NFL;
