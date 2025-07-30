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
            <></>
          ))}
        </>
      )}
    </div>
  );
};

export default MatchupTable;
