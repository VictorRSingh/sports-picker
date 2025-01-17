import { Game } from "@/types/Game";
import React from "react";
import { useRouter } from "next/navigation";
import MatchupRow from "./MatchupRow";
import MatchupHeader from "./MatchupHeader";
import MatchupTable from "./MatchupTable";

interface MatchupSheetProps {
  matchups: Game[];
}

const MatchupSheet = ({ matchups }: MatchupSheetProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4 items-center text-sm md:text-base w-full">
      <h1 className="uppercase font-bold text-2xl lg:text-4xl">
        Upcoming Matchups
      </h1>
      <MatchupTable matchups={matchups} />
    </div>
  );
};

export default MatchupSheet;
