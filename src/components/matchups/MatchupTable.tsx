import { Game } from "@/types/Game";
import React from "react";
import MatchupHeader from "./MatchupHeader";
import MatchupRow from "./MatchupRow";
import { useRouter, usePathname } from "next/navigation";

interface MatchupTableProps {
    matchups: Game[];
}

const MatchupTable = ({matchups}: MatchupTableProps) => {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname)
  return (
    <div className="bg-neutral-800 rounded p-4">
      {matchups && matchups.length > 0 && (
        <>
          <MatchupHeader />
          {matchups.map((matchup, index) => (
            <div
              key={index}
              className="grid grid-cols-1 w-full my-4 border p-2 rounded cursor-pointer"
              onClick={(() => router.push(`/g/${matchup.gameUrl}&away=${matchup.away.teamUrl}&home=${matchup.home.teamUrl}&sport=${pathname.split("/")[1]}`))}
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
