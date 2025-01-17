import { Game } from "@/types/Game";
import React from "react";
import MatchupHeader from "./MatchupHeader";
import MatchupRow from "./MatchupRow";
import { useRouter } from "next/navigation";

interface MatchupTableProps {
    matchups: Game[];
}

const MatchupTable = ({matchups}: MatchupTableProps) => {
  const router = useRouter();
  return (
    <div className="bg-neutral-800 rounded p-4">
      {matchups && matchups.length > 0 && (
        <>
          <MatchupHeader />
          {matchups.map((matchup, index) => (
            <div
              // href={`https://foxsports.com${matchup.gameUrl}`}
              // target="_blank"
              key={index}
              className="grid grid-cols-1 w-full my-4 border p-2 rounded cursor-pointer"
              onClick={(() => router.push(`/g/${matchup.gameUrl.split("?")[0]}`))}
            >
              {/* Away Team */}
              <MatchupRow key={matchup.away.short} team={matchup.away} />

              {/* Home Team */}
              <MatchupRow key={matchup.home.short} team={matchup.home} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MatchupTable;
