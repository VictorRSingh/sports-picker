import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Gamelog } from "@/types/Gamelog";
import { Player } from "@/types/Player";
import AiPromptsFilter from "./AiPromptsFilter";
import { useTeam } from "@/hooks/useTeams";
import { usePathname } from "next/navigation";
import { Team } from "@/types/Team";
import { useTeamStats } from "@/hooks/useTeamStats";
import { MdOutlineInfo } from "react-icons/md";

interface AiPromptsProps {
  gameLogs: Gamelog;
  player: Player;
}

const AiPrompts = ({ gameLogs, player }: AiPromptsProps) => {
  const pathname = usePathname();
  const { teams } = useTeam(pathname.split("/")[1]);
  const { teamStats, fetchTeamStats } = useTeamStats();
  const [selectedTeam, setSelectedTeam] = useState<Team>({
    name: "",
    image: "",
    sport: "",
    webUrl: "",
  });

  const [showInfo, setShowInfo] = useState<Record<string, boolean>>({});

  const [response, setResponse] = useState<any>();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBRV9n6tEoOcMOEpehbv_AjtU6j3r5WLlM"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
  Here is the gamelog data for ${player.name}:
  ${JSON.stringify(gameLogs)}

  ${
    selectedTeam.name !== ""
      ? `${player.name} is going up against ${
          selectedTeam.name
        }, here is the defensive stats for ${selectedTeam.name}:
    
    ${JSON.stringify(
      teamStats && teamStats.headers.columns
    )} \n\n ${JSON.stringify(
          teamStats?.rows.find((team) =>
            team.columns[0].text.includes(selectedTeam.name)
          )
        )}
    `
      : ""
  }

  
  Using this data:
  1. Provide predictions or projections for the player's future performance ${
    selectedTeam && `against the ${selectedTeam.name}`
  }.
  2. Return the data in a JSON format with this structure:
     [
         {
             "statName": "Stat Name",
             "projectedValue": Numeric Value,
             "opposingTeamName": "Opposing Team name if applicable",
             "opposingTeamsDefense": "Your Take on the opposing teams defense, if there is one, and why you think the player will achieve the projected stats",
         }
     ]
  3. Ensure each stat is listed as a separate object in the array.
  4. Ensure that projectedValue is not in a string form such at '7/18' or '3/9', if it is a string, you should turn that value into a number
  5. Do not include any additional text or explanation outside the JSON.
  `;

  const fetchAiResponse = async () => {
    console.log("Prompt", prompt);
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    // Process the response to add newlines after each series of numbers
    const formattedResponse = rawResponse
      .replace("```json", "")
      .replace("```", "");

    setResponse(JSON.parse(formattedResponse));
  };

  useEffect(() => {
    fetchAiResponse();
  }, []);

  useEffect(() => {
    console.log(response);
  }, [response]);


  useEffect(() => {
    const fetchData = async () => {
      if (selectedTeam) {
        await fetchTeamStats(selectedTeam.sport); // Fetch the team stats
      }
    };
  
    fetchData();
  }, [selectedTeam]);
  
  useEffect(() => {
    const processStats = async () => {
      if (teamStats) {
        setResponse(undefined); // Clear the previous response
        await fetchAiResponse(); // Fetch the AI response based on the updated teamStats
      }
    };
  
    processStats();
  }, [teamStats]);

  const toggleInfo = (statName: string) => {
    setShowInfo((prev) => ({
      ...prev,
      [statName]: !prev[statName],
    }));
  };

  return (
    <div className="">
      {teams && selectedTeam && setSelectedTeam && (
        <div className="flex flex-col md:flex-row gap-x-2">
          <h1>{player.name} @ </h1>
          <AiPromptsFilter
            player={player}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />
        </div>
      )}

      {response !== undefined? (
        <div className="">
          <div className="grid grid-cols-2 gap-4 items-center">
            {response && response?.map(
              (stat: {
                statName: string;
                projectedValue: number;
                opposingteamName?: string;
                opposingTeamsDefense: string;
              }) => (
                <div
                  key={stat.statName + stat.projectedValue}
                  className="flex flex-col p-4 border-b border-gray-700 col-span-full lg:col-span-1"
                >
                  <h1 className="text-xs font-semibold">{stat.statName}</h1>
                  <div className="flex items-center justify-between gap-x-4 w-full relative">
                    <h1 className="text-5xl flex-grow">
                      {stat.projectedValue}
                    </h1>
                    <button onClick={() => toggleInfo(stat.statName)}>
                      <MdOutlineInfo className="text-3xl" />
                    </button>
                    <div
                      className={`absolute top-0 ${
                        showInfo[stat.statName] ? "flex" : "hidden"
                      } h-full justify-between items-center overflow-y-auto max-h-12 bg-neutral-800 rounded w-full text-xs`}
                    >
                      <p className="h-full flex">{stat.opposingTeamsDefense}</p>
                      <button onClick={() => toggleInfo(stat.statName)}>
                        <MdOutlineInfo className="text-3xl" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        "Loading predictions..."
      )}
    </div>
  );
};

export default AiPrompts;
