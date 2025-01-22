import { Player } from "@/types/Player";
import { Team } from "@/types/Team";
import React, { Dispatch, SetStateAction, useState } from "react";

interface AiPromptsFilterProps {
  player: Player;
  teams: Team[];
  selectedTeam: Team;
  setSelectedTeam: Dispatch<SetStateAction<Team>>;
}

const AiPromptsFilter = ({
  player,
  teams,
  selectedTeam,
  setSelectedTeam,
}: AiPromptsFilterProps) => {
  return (
    <div className="">
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
          teams.filter((team) => team.name.toLowerCase() !== player.details?.team?.toLowerCase()).map((team, index) => (
            <option value={team.name} key={index}>
              {team.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default AiPromptsFilter;
