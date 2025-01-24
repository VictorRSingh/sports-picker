import { BettingStyleEnum } from "@/enums/BettingStyleEnum";
import { Player } from "@/types/Player";
import { Team } from "@/types/Team";
import React, { Dispatch, SetStateAction, useState } from "react";

interface AiPromptsFilterProps {
  player: Player;
  teams: Team[];
  selectedTeam: Team;
  setSelectedTeam: Dispatch<SetStateAction<Team>>;
  selectedBettingStyle: BettingStyleEnum;
  setSelectedBettingStyle: Dispatch<SetStateAction<BettingStyleEnum>>
}

const AiPromptsFilter = ({
  player,
  teams,
  selectedTeam,
  setSelectedTeam,
  selectedBettingStyle,
  setSelectedBettingStyle
}: AiPromptsFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between px-4 w-full">
      <div className="">
        <h1>{`${player.name} @`}</h1>
        <select
          value={selectedTeam.name}
          onChange={(e) => {
            const selected = teams.find((team) => team.name === e.target.value);
            if (selected) setSelectedTeam(selected);
          }}
          className="text-black"
        >
          <option value={""} disabled>
            Select a Team
          </option>
          {teams &&
            teams
              .filter(
                (team) =>
                  team.name.toLowerCase() !==
                  player.details?.team?.toLowerCase()
              )
              .map((team, index) => (
                <option value={team.name} key={index}>
                  {team.name}
                </option>
              ))}
        </select>
      </div>
      <div className="">
        <h1>Betting Style</h1>
        <select
          value={selectedBettingStyle}
          onChange={(e) => setSelectedBettingStyle(e.target.value as BettingStyleEnum)}
          className="text-black"
        >
          <option value={""} disabled>
            Select a betting style
          </option>
          {Object.values(BettingStyleEnum).map((style, index) => (
            <option value={style} key={index}>{style}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AiPromptsFilter;
