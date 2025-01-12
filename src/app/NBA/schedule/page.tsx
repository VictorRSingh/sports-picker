"use client";

import MatchupView from "@/components/nba/MatchupView";
import useSchedule from "@/hooks/useSchedule";
import { Matchup } from "@/interfaces/Matchup";
import React from "react";

const schedule = () => {
  const date = new Date();
  const localISODate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  const { schedule } = useSchedule("nba", localISODate);

  if (schedule) {
    console.log("Schedule", schedule.date);
  }

  return (
    <div className="p-4 md:mx-[15%] h-fit w-full mt-20 flex flex-col gap-y-4">
      <h1 className="text-xl font-bold">{localISODate}</h1>
      <div className="flex flex-col gap-y-4 border-4 p-2">
        {schedule && schedule.matchups.map((matchup, index) => (
            <MatchupView key={index} matchup={matchup} />
        ))}
      </div>
    </div>
  );
};

export default schedule;
