import ScheduleCard from "@/components/schedule/ScheduleCard";
import StandingsCard from "@/components/standings/StandingsCard";
import React from "react";

type SportHomeViewProps = {
  sport: string;
};

const SportHomeView = ({ sport }: SportHomeViewProps) => {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <ScheduleCard sport={sport} />
      <StandingsCard sport={sport} />
    </div>
  );
};

export default SportHomeView;
