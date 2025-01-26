import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Gamelog } from "@/types/Gamelog";
import { Player } from "@/types/Player";
import AiPromptsFilter from "./AiPromptsFilter";
import { useTeam } from "@/hooks/useTeams";
import { usePathname } from "next/navigation";
import { Team } from "@/types/Team";
import { useTeamStats } from "@/hooks/useTeamStats";
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

  const [extraDetails, setExtraDetails] = useState<string[]>([]);

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
    "Aggressive": "- Emphasize 90th percentile outcomes\n- High variance tolerance\n- +15% to upper projections",
    "Normal": "- Balance median expectations\n- ±5% variance buffer",
    "Passive": "- 25th percentile floor projections\n- +10% risk buffer",
    "Watered": "- Alternate lines only\n- 97-100% confidence required\n- Create non-book lines when justified"
  }[selectedBettingStyle]
}

  
  # Player Prop Context
  ${JSON.stringify(playerProps || [])}

# Extra Details Context
${extraDetails.length > 0 ? JSON.stringify(extraDetails) : "No extra details to consider"}

  
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
     - Take into consideration the extra details if they are note-worthy
  
  ## Required Output Format
  \`\`\`json
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
        "type": "[REQUIRED_BETTING_STYLE]",
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
  \`\`\`
  
  **Validation Constraints:**
  - Watered bets must always appear
  - Numeric values only (no null/undefined)
  - Watered bets require ≥4 recommendations
  - Confidence ranges:
    - Betslip: 70-100%
    - Watered: 95-100%
    - Regular: 50-94%
  - Strict stat abbreviation adherence
  - JSON must use DOUBLE quotes only
  - No trailing commas
  - Decimal numbers only (no fractions)
  - Empty arrays preferred over null/undefined
  - All stat abbreviations must match: ${JSON.stringify(player.stats?.map(s => s.abbr) || [])}
  `;

  
  const fetchAiResponse = async () => {
    try {
      setResponse(undefined);
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();
      
      // Enhanced JSON parsing with fallbacks
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      const formattedResponse = jsonMatch ? jsonMatch[1].trim() : rawResponse;
      
      // Parse with error recovery
      const parsed = JSON.parse(formattedResponse);
      
      // Ensure watered bets array exists
      const finalResponse = {
        projections: parsed.projections || [],
        betRecommendations: parsed.betRecommendations || [],
        propsRecommendations: parsed.propsRecommendations || [],
        bettingSlipRecommendation: parsed.bettingSlipRecommendation || [],
        wateredBetRecommendation: parsed.wateredBetRecommendation || []
      };
  
      setResponse(finalResponse);
    } catch (err) {
      console.error('Processing Error:', err);
      // Add retry logic or error feedback
    }
  };

  useEffect(() => {
    console.log(prompt);
  }, [prompt])

  useEffect(() => {
    if(!response) {
      fetchAiResponse();
    }
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTeam) {
        await fetchTeamStats(selectedTeam.sport); // Fetch the team stats
      }
    };

    fetchData();
  }, [selectedTeam]);

  return (
    <div className="flex flex-col lg:flex-row">
      {teams && selectedTeam && setSelectedTeam && (
        <div className="flex flex-col gap-x-2 min-w-60 lg:max-w-60">
          <AiPromptsFilter
            player={player}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            selectedBettingStyle={selectedBettingStyle}
            setSelectedBettingStyle={setSelectedBettingStyle}
            response={response}
            fetchAiResponse={fetchAiResponse}
            extraDetails={extraDetails}
            setExtraDetails={setExtraDetails}
          />
        </div>
      )}

      {response !== undefined ? (
        <div className="p-2 flex-grow w-full">
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
