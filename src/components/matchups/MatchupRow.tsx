import { Game } from "@/types/Game";
import React from "react";

interface MatcupRowProps {
    team: Game['away'] | Game['home'];
}

const MatchupRow = ({team}: MatcupRowProps) => {
  return (
    <div>
      <div className="col-span-1">
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <div className="flex gap-x-2 md:hidden">
              <h1 className=" font-semibold">{team.short}</h1>
              <p>@</p>
            </div>
            <div className="hidden gap-x-2 md:flex">
              <h1 className=" font-semibold">{team.team}</h1>
              <p>@</p>
            </div>
          </div>
          <div className="col-span-1 text-center font-semibold">
            {team.spread}
          </div>
          <div className="col-span-1 text-center font-semibold">
            {team.moneyline}
          </div>
          <div className="col-span-1 text-center font-semibold">
            {team.total}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchupRow;
