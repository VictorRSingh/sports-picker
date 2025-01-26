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
  Analyze sports betting opportunities for ${player.name} using the following structured data:
  
  # Player Context
  **Recent Performance:**
  ${JSON.stringify(gameLogs.rows || [])}
  
  ${selectedTeam.name ? `
  # Matchup Context
  **Opposing Team (${selectedTeam.name}) Defense:**
  - Headers: ${JSON.stringify(teamStats?.headers?.columns || [])}
  - Stats: ${JSON.stringify(
    teamStats?.rows?.find(team => 
      team.columns[0]?.text?.includes(selectedTeam.name)
    )?.columns || []
  )}` : ""}
  
  # Betting Context
  **Wagering Style:** ${selectedBettingStyle}
  ${
    {
      "Aggressive": "- Emphasize 90th percentile outcomes\\n- High variance tolerance\\n- +15% to upper projections",
      "Normal": "- Balance median expectations\\n- ±5% variance buffer",
      "Passive": "- 25th percentile floor projections\\n- +10% risk buffer",
      "Watered": "- Alternate lines only\\n- 97-100% confidence required\\n- Create non-book lines when justified"
    }[selectedBettingStyle]
  }
  
  # Player Prop Context
  ${JSON.stringify(playerProps || [])}
  
  ## Analysis Requirements
  1. **Data Processing**
     - Convert all fractional stats to decimals
     - Use exact column values from: ${JSON.stringify(gameLogs.headers?.columns || [])}
     - Validate stat abbreviations against: ${JSON.stringify(player.stats?.map(s => s.abbr) || [])}
  
  2. **Projection Weights**
     - Recent Form: 40%
     - Season Averages: 30%
     - Matchup Defense: 20%
     - Style Adjustment: 10%
  
  3. **Recommendation Rules**
     - Include all props with edge analysis (positive/negative)
     - Watered bets require 4+ props at 95-97% confidence
     - Betslip must have ≥72% confidence
     - Consider historical player-team dynamics
  
  ## Required Output Format
  \\\`\\\`\\\`json
  {
    "projections": [
      {
        "stat": "ValidStatAbbreviation",
        "projection": 28.9,
        "confidence": 72,
        "matchupLeverage": "Specific defensive weakness",
        "trend": "3-game streak type"
      }
    ],
    "betRecommendations": [
      {
        "type": "${selectedBettingStyle}",
        "market": "Points Over/Under",
        "edge": "HIGH",
        "rationale": "Line-specific analysis with comparison"
      }
    ],
    "propsRecommendations": [
      {
        "prop": "Points",
        "recommendation": "Over 27.5",
        "rationale": "Trend vs defensive matchup",
        "confidence": 85
      }
    ],
    "bettingSlipRecommendation": [
      {
        "prop": "Rebounds",
        "recommendation": "Under 8.5",
        "confidence": 78,
        "rationale": "Matchup-specific justification"
      }
    ],
    "wateredBetRecommendation": [
      {
        "prop": "Assists",
        "recommendation": "Over 4.5",
        "confidence": 96,
        "rationale": "High-volume trend analysis"
      }
    ]
  }
  \\\`\\\`\\\`
  
  **Validation Constraints:**
  - Maximum 5 projections
  - Numeric values only (no null/undefined)
  - Watered bets require ≥4 recommendations
  - Confidence ranges:
    - Betslip: 70-100%
    - Watered: 95-100%
    - Regular: 50-94%
  - Strict stat abbreviation adherence
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
