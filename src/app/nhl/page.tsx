"use client";

import MatchupSheet from "@/components/matchups/MatchupSheet";
import { useMatchup } from "@/hooks/useMatchup";
import React from "react";

const NHL = () => {
  const { matchups } = useMatchup("nhl");

  console.log(matchups);
  return (
    <MatchupSheet matchups={matchups} />
  );
};

export default NHL;
