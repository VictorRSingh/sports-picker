import { BettingStyleEnum } from "@/enums/BettingStyleEnum";
import { ExploitableLines, Projection, RecommendedBet, WateredBet } from "@/hooks/useAiResponse";
import { Player } from "@/types/Player";
import { Team } from "@/types/Team";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface AiPromptsFilterProps {
  player: Player;
  teams: Team[];
  selectedTeam: Team;
  setSelectedTeam: Dispatch<SetStateAction<Team>>;
  selectedBettingStyle: BettingStyleEnum;
  setSelectedBettingStyle: Dispatch<SetStateAction<BettingStyleEnum>>;
  extraDetails: string[];
  setExtraDetails: Dispatch<SetStateAction<string[]>>;
  AIResponse: {
      projections: Projection[];
      recommendations: RecommendedBet[];
      wateredBets: WateredBet[];
      exploitableLines: ExploitableLines[];
    } | null;
  setAiResponse: Dispatch<SetStateAction<{
      projections: Projection[];
      recommendations: RecommendedBet[];
      wateredBets: WateredBet[];
      exploitableLines: ExploitableLines[];
    } | null>>;
  fetchAiResponse: (prompt: string | null) => Promise<void>;
  AiPrompt: string;
}

const AiPromptsFilter = ({
  player,
  teams,
  selectedTeam,
  setSelectedTeam,
  selectedBettingStyle,
  setSelectedBettingStyle,
  extraDetails,
  setExtraDetails,
  AIResponse,
  setAiResponse,
  fetchAiResponse,
  AiPrompt
}: AiPromptsFilterProps) => {
  const [extraDetailsInput, setExtraDetailsInput] = useState<string>("");

  return (
    <div className="flex flex-col gap-y-4 px-4 w-full">
      <div className="w-full">
        <h1 className="text-xl">Opposition?</h1>
        <select
          value={selectedTeam.name}
          onChange={(e) => {
            const selected = teams.find((team) => team.name === e.target.value);
            if (selected) setSelectedTeam(selected);
          }}
          className="text-black w-full rounded py-1 px-2"
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
      <div className="w-full">
        <h1 className="text-xl">Betting Style</h1>
        <select
          value={selectedBettingStyle}
          onChange={(e) =>
            setSelectedBettingStyle(e.target.value as BettingStyleEnum)
          }
          className="text-black w-full rounded py-1 px-2"
        >
          <option value={""} disabled>
            Select a betting style
          </option>
          {Object.values(BettingStyleEnum).map((style, index) => (
            <option value={style} key={index}>
              {style}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex flex-col gap-y-2">
        <h1 className="text-xl">Extra Details</h1>
        {extraDetails.length > 0 && (
          <ol className="bg-gray-500 rounded p-2 ">
            {extraDetails.map((detail, index) => (
              <li
                className="flex gap-x-1 justify-between border rounded shadow-md mb-2 p-2"
                key={index}
              >
                <p>{detail}</p>
                <button
                  onClick={() => {
                    setExtraDetails((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <FaTrash className="text-red-300" />
                </button>
              </li>
            ))}
          </ol>
        )}
        <div className="w-full flex flex-col gap-y-2">
          <input
            className="text-black px-2 py-1 rounded"
            type="text"
            value={extraDetailsInput}
            onChange={(e) => setExtraDetailsInput(e.target.value)}
          />
          <button
            className="p-1 text-sm bg-blue-400 rounded"
            onClick={() => {
              if (extraDetailsInput.trim() !== "") {
                setExtraDetails((prev) => [...prev, extraDetailsInput]); // ✅ Create a new array
                setExtraDetailsInput("");
              }
            }}
          >
            Add Detail
          </button>
        </div>
      </div>
      <div className="w-full">
        <button
          className={`w-full px-2 py-1 rounded ${
            AIResponse ? "bg-green-500 cursor-pointer" : "bg-gray-500 cursor-wait disabled"
          }`}
          onClick={() => {
            if(AiPrompt) {
              setAiResponse(null)

              fetchAiResponse(AiPrompt);
            }
          }}
        >
          {`${AIResponse !== null ? "Generate Projections" : "Please Wait"}`}
        </button>
      </div>
    </div>
  );
};

export default AiPromptsFilter;
