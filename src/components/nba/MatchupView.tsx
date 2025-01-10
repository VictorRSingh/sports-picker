import { Matchup } from "@/interfaces/Matchup";
import React from "react";
import { useRouter } from "next/navigation";

interface MatchupProps {
  matchup: Matchup;
}
const MatchupView = ({ matchup }: MatchupProps) => {
  const router = useRouter();
  const awayTeam = matchup.teams[0];
  const homeTeam = matchup.teams[1];
  console.log(matchup);
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 items-center justify-center place-items-start w-full">
      <div className="flex gap-x-2 items-center md:text-xl col-span-1">
        <img src={awayTeam.logo} className="w-4 md:w-10" />
        <h1 className="block md:hidden">{awayTeam.shortName}</h1>
        <h1 className="md:block hidden">{awayTeam.name}</h1>
      </div>
      <p className="flex justify-center w-full col-span-1">@</p>
      <div className="flex gap-x-2 items-center md:text-xl col-span-1">
        <img src={homeTeam.logo} className="w-4 md:w-10" />
        <h1 className="block md:hidden">{homeTeam.shortName}</h1>
        <h1 className="md:block hidden">{homeTeam.name}</h1>
      </div>
      <div className="flex justify-center col-span-1 md:col-span-2 w-full">
        <button
          className="px-2 py-1 rounded bg-green-400 md:w-3/4"
          onClick={() => router.push(matchup.matchLink)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default MatchupView;
