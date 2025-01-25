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
import { BettingStyleEnum } from "@/enums/BettingStyleEnum";
import PlayerProjections from "./PlayerProjections";
import { PlayerProps } from "@/types/PlayerProps";

interface AiPromptsProps {
  gameLogs: Gamelog;
  player: Player;
  playerProps: PlayerProps[];
}

const AiPrompts = ({ gameLogs, player, playerProps }: AiPromptsProps) => {
  const pathname = usePathname();
  const { teams } = useTeam(pathname.replace("/p", "").split("/")[1]);
  const { teamStats, fetchTeamStats } = useTeamStats();
  const [selectedTeam, setSelectedTeam] = useState<Team>({
    name: "",
    image: "",
    sport: "",
    webUrl: "",
  });
  const [selectedBettingStyle, setSelectedBettingStyle] =
    useState<BettingStyleEnum>(BettingStyleEnum.normal);

  const [showInfo, setShowInfo] = useState<Record<string, boolean>>({});

  const [response, setResponse] = useState<any>();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBRV9n6tEoOcMOEpehbv_AjtU6j3r5WLlM"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
  Analyze sports betting opportunities for ${
    player.name
  } using the following structured data:
  
  [PLAYER CONTEXT]
  Recent Performance:
  ${JSON.stringify(gameLogs.rows || [])}
  
  ${
    selectedTeam.name
      ? `[MATCHUP CONTEXT]
  Opposing Team (${selectedTeam.name}) Defense:
  Headers: ${JSON.stringify(teamStats?.headers?.columns || [])}
  Stats: ${JSON.stringify(
    teamStats?.rows?.find((team) =>
      team.columns[0]?.text?.includes(selectedTeam.name)
    )?.columns || []
  )}
  `
      : ""
  }
  
  [BETTING CONTEXT]
  Wagering Style: ${selectedBettingStyle}
  (${
    selectedBettingStyle === "Aggressive"
      ? "Emphasize 90th percentile outcomes with high variance tolerance"
      : selectedBettingStyle === "Normal"
      ? "Balance median expectations with moderate variance buffers"
      : "Prioritize 25th percentile floor projections with maximum risk mitigation"
  })

  [PLAYER PROP CONTEXT]
  Player Props: ${JSON.stringify(playerProps || [])}
  
  Generate projections following these rules:
  1. Convert fractional stats to numeric values
  2. Weight factors:
     - Recent form (40%)
     - Season averages (30%)
     - Matchup defense (20%)
     - Betting style (10%)
  3. Style adjustment: ${
    selectedBettingStyle === "Aggressive"
      ? "Add 15% to 90th percentile outcomes"
      : selectedBettingStyle === "Normal"
      ? "Use median values ±5% variance"
      : "Use 25th percentile floor + 10% buffer"
  }
  4. Be sure to include each stat in the betRecommendations, weather it be a bad bet or good bet and give your reasoning as well as either the positive or negative edge
  5. Curate a list of props you think is good with a signifigant high context based on the wagering style
  6. Create a betslip with high confidence props
  
  Required JSON response format:
  {
    "projections": [
      {
        "stat": "Stat Name",
        "projection": 28.9,
        "confidence": 72,
        "matchupLeverage": "Opponent allows ...",
        "trend": "3-game increasing streak"
      }
    ],
    "betRecommendations": [
      {
        "type": "${selectedBettingStyle}",
        "market": "Player Stat Over or Under recommendation",
        "edge": Calculated Edge depending on player over under line, give it as either a LOW, MEDIUM, or HIGH value,
        "rationale": "Explain Why you chose this, can you include a line for the Over/Under "
      }
    ],
    "propsRecommendations: [
      {
        prop: "The market for the prop",
        recommendation: "The recommended line to take either over or under",
        "rationale": "Explain Why you chose this",
        "confidence": 72,
      }
    ],    
    "bettingSlipRecommendation": [
        {
          prop: "The Market for the prop",
          recommendation: "The recommended line to take either over or under",
          "confidence": 72,
        }
      ]
  }
  
  Validation Rules:
  - Numeric values only (no strings)
  - Use exact column.text values from: ${JSON.stringify(
    gameLogs.headers?.columns || []
  )}
  - Stat abbreviations from: ${JSON.stringify(
    player.stats?.map((s) => s.abbr) || []
  )}
  - Max 5 projections
  - No null/undefined values
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

  useEffect(() => {
    const processStats = async () => {
      if (selectedBettingStyle) {
        setResponse(undefined); // Clear the previous response
        await fetchAiResponse(); // Fetch the AI response based on the updated teamStats
      }
    };

    processStats();
  }, [selectedBettingStyle]);

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
          <AiPromptsFilter
            player={player}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            selectedBettingStyle={selectedBettingStyle}
            setSelectedBettingStyle={setSelectedBettingStyle}
          />
        </div>
      )}

      {response !== undefined ? (
        <div className="">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="col-span-full mt-4">
              {response && <PlayerProjections data={response} />}
            </div>
          </div>
        </div>
      ) : (
        "Loading predictions..."
      )}
    </div>
  );
};

export default AiPrompts;
