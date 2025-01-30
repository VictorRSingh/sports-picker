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
import { alternateLines } from "../../../public/data/AlternateLines";

interface AiPromptsProps {
  gameLogs: Gamelog;
  player: Player;
  playerProps: PlayerProps[];
}

const AiPrompts = ({ gameLogs, player, playerProps }: AiPromptsProps) => {
  const pathname = usePathname();
  const sport = pathname.split("/")[2].toUpperCase() as keyof typeof alternateLines[0];

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
    "AIzaSyA3nMt9_5UiaPVevkUYavZEpuPeIZFAWrc"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b-exp-0924" });

  const pPlayerStats = player.stats && player.stats?.flatMap(player => player.name);
  const pPlayerMarkets = playerProps && playerProps.flatMap(prop => prop.market);
  const pAlternateMarkets = Object.keys(alternateLines[0][sport]);
  console.log("pAlternateMarkets", pAlternateMarkets)
  console.log("PlayerStats", pPlayerStats);
  console.log("PlayerMarkets", pPlayerMarkets);

  const prompt = `You are a sports betting assistant analyzing player prop bets. You are analyzing a player in the nba. Provide an expected range of outcomes and a betting suggestion based on historical trends, defensive matchups, and sportsbook odds for ${player.name}.

  # Core Inputs
  - PLAYER CONTEXT
    - Recent Gamelog:
      ${JSON.stringify(gameLogs)}
    - Key Stats:
      ${JSON.stringify(player.stats)}
    - Player Props:
      ${JSON.stringify(playerProps)}
    - Alternate Lines:
      ${JSON.stringify(alternateLines[0][sport])}
  
  - OPPOSITION DEFENSE
    ${selectedTeam.name && teamStats !== undefined
      ? `\n ${selectedTeam.name} defense: ${JSON.stringify(teamStats)}`
      : "No Team Stats to compare against"}
  
  - BETTING PARAMETERS
    - Betting Style: ${selectedBettingStyle}
      - Aggressive: +10% boost to projection.
      - Normal: Use the raw median projection.
      - Passive: -10% reduction in projection.
      - Watered: -20% reduction in projection.
  
  - ADDITIONAL FACTORS
    ${extraDetails.length > 0
        ? `- User-Provided Extra Details:\n ${JSON.stringify(extraDetails)}`
        : "- No additional details provided"}
  
  # Analysis Requirements
  - PROJECTION MODEL
    - Weights: Recent Games 60% | Season 10% | Matchup 10% | Style 20%.
    - **Ensure that projections are generated for ALL alternate markets: ${JSON.stringify(pAlternateMarkets)}**.
    - Use **Adjusted Median Projection**: 
      - Standard median projection.
      - Weight **high-end scoring games (90th percentile) at 15%** to adjust for explosive performances.
      - Include **low-end performances (10%)** to maintain risk balance.
    - Validate stats against: ${JSON.stringify(pAlternateMarkets)}.
  
  - WATERED BET RULES
    - Must be an **alternate market option**: ${JSON.stringify(pAlternateMarkets)}.
    - **Generate at least 4 alternate lines per market** if none exist.
    - Iterate through **all alternate lines**.
    - Sample size **≥ 7 games**.
    - **Include at least two "Over" bets** in Watered Bets.
    - If no milestone market exists, **select another** that is:
      - The closest whole number above or below the median projection.
      - If multiple sportsbooks have different lines, select the **most common line**.
  
  - BETTING SLIP RULES
    - **Ensure that recommendations are generated for ALL alternate markets: ${JSON.stringify(pAlternateMarkets)}**.
    - **Provide at least one "Over" recommendation per market if justified**.
  
  # Expected Output
  \`\`\`json
  {
    "projections": [
      {
        "stat": "<playerStat>",
        "projection": <adjustedProjection>,
        "matchupImpact": "<rationale>"
      }
    ],
  
    "wateredBetRecommendation": [
      {
        "market": "<MILESTONEMARKET>",
        "recommendation": "<Over/Under> <whole number>",
        "edge": <boostedEdge>,
        "confidence": 90.0-100.0,
        "rationale": "<% hit rates + matchup logic>"
      }
    ],
  
    "bettingSlipRecommendation": [
      {
        "market": "<STANDARDMARKET>",
        "recommendation": "<Over/Under> <decimal>",
        "confidence": <numberValue>,
        "sportsbook": "<Sportsbook Name>",
        "odds": "<Best available odds>",
        "rationale": "<median vs line + matchup>"
      }
    ]
  }
  \`\`\`
  `;

    
  // Updated fetchAiResponse with type safety
  type BetRecommendation = {
    market: string;
    recommendation: string;
    edge: string;
    confidence: number;
    sportsbookLines?: string[];
    rationale?: string;
  };

  type Projection = {
    stat: string;
    projection: number;
    matchupImpact: string;
  };

  const fetchAiResponse = async () => {
    try {
      setResponse(undefined);
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();

      // Type-safe parsing
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      const formattedResponse = jsonMatch ? jsonMatch[1].trim() : rawResponse;

      const parsed = JSON.parse(formattedResponse) as {
        projections?: Projection[];
        wateredBetRecommendation?: BetRecommendation[];
        bettingSlipRecommendation?: BetRecommendation[];
      };

      // Normalize responses with fallbacks
      const finalResponse = {
        projections:
          parsed.projections?.map((p) => ({
            stat: p.stat,
            projection: p.projection || 0,
            matchupImpact: p.matchupImpact || "",
          })) || [],

        wateredBetRecommendation:
          parsed.wateredBetRecommendation?.map((b) => ({
            market: b.market,
            recommendation: b.recommendation,
            edge: b.edge,
            confidence: Math.min(100, Math.max(90, b.confidence)), // Enforce watered confidence
            sportsbookLines: b.sportsbookLines || [],
            rationale: b.rationale,
          })) || [],

        bettingSlipRecommendation:
          parsed.bettingSlipRecommendation?.map((b) => ({
            market: b.market,
            recommendation: b.recommendation,
            confidence: Math.min(100, Math.max(60, b.confidence)), // Enforce betslip range
            rationale: b.rationale,
          })) || [],
      };

      setResponse(finalResponse);
    } catch (err) {
      console.error("Processing Error:", err);
      // Consider error state handling
    }
  };

  useEffect(() => {
    console.log(prompt);
  }, [prompt]);

  useEffect(() => {
    if (!response) {
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
              {response && (
                <PlayerProjections
                  data={response}
                  selectedTeam={selectedTeam}
                />
              )}
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
