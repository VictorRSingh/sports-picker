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
  Analyze betting opportunities for ${player.name} with emphasis on alternate lines. Follow this structure:
  
  # Core Inputs
  1. PLAYER CONTEXT
  - Recent GameLog: ${JSON.stringify(gameLogs)}
  - Key Stats: ${JSON.stringify(player.stats)}
  - Player Props: ${JSON.stringify(playerProps)}
  
  2. OPPOSITION ANALYSIS
  ${
    selectedTeam.name && teamStats != undefined
      ? `
    ${selectedTeam.name} defense:
    ${JSON.stringify(teamStats)}
    `
      : "No Team to compare with"
  }
  
  3. BETTING PARAMETERS
  - Style: ${selectedBettingStyle}
    ${
      {
        Aggressive: "» Focus: 90th percentile outcomes (+15% boost)",
        Normal: "» Balance: Median expectations (±5% buffer)",
        Passive: "» Conservative: 25th percentile floors (+10% buffer)",
        Watered:
          "» Strategy: Alternate lines only\n» Targets: Sportsbook milestones (e.g., 20+ pts, 5+ ast)\n» Confidence: 97%+ required",
      }[selectedBettingStyle]
    }
  
  # Analysis Requirements
  1. PROJECTION MODEL
  - Convert fractions → decimals
  - Weights: Recent 40% | Season 20% | Matchup 20% | Style 20%
  - Validate stats against: [${player.stats?.map((s) => s.abbr).join(", ")}]
  
  2. WATERED BET RULES
  - Require ≥4 recommendations
  - Must include 2+ milestone markets (e.g., 20+ pts)
  - 97-100% confidence only
  - Prioritize: Player-team history → Current form → Matchup
  - High hit rates only (80% - 100%)
  - Reject any bet with:
    • Raw game counts in rationale ("X/Y games")
    • Sample size <10 games
    • Hit rate <80%
  - Required format:
    "Projected [value] ([XX.X]% hit rate in [category])"
  
  3. OUTPUT CONSTRAINTS
  - Decimals only, no trailing commas
  - Empty arrays if no matches
  - Confidence tiers:
    Betslip: 72-100%
    Watered: 97-100%
    Regular: 50-94%
  
  # Expected Output
  \`\`\`json
  {
    "projections": [{
      "stat": "<playerStat>",
      "range": [<calculatedFloor>, <calculatedCeiling>],
      "vsLine": <calculateDeviation>,
      "matchupImpact": <matchupRational>
    }],
    
    "wateredBetRecommendation": [{
      "market": "<playerStatMarket>",
      "recommendation": "<altLineRecommendationWithHighConfidence>",
      "edge": <calculatedEdge>,
      "confidence": <calculatedConfidence>,
      "rationale": <rationale>
    }],
    
    "bettingSlipRecommendation": [{
      "market": "<playerStatMarket>",
      "rationale": "<rationale>",
      "confidence": <calculatedConfidence>
      "recommendation": "<RecommendationWithHighConfidence>",
    }]
  }
  \`\`\`
  
  # Instructions for Analysis
  1. **Projections**:
     - Calculate floor and ceiling for each stat based on the weighted model (Recent 40%, Season 20%, Matchup 20%, Style 20%).
     - Express matchup impact as a percentage (e.g., "5% PPG Impact").
     - Ensure all values are in decimals and match the stat abbreviations: ${player.stats?.map((s) => s.abbr).join(", ")}.
  
  2. **Watered Bet Recommendations**:
     - Only include recommendations with 97-100% confidence.
     - Ensure at least 2 milestone markets are included.
     - Use the format: "Projected [value] ([XX.X]% hit rate in [category])".
     - Reject any bet with raw game counts, sample size <10, or hit rate <80%.
  
  3. **Betting Slip Recommendations**:
     - Include recommendations with 72-100% confidence.
     - Provide a clear rationale for each recommendation.
     - Avoid raw game counts in the rationale.
  
  # Critical Validation
  - Watered bets MUST include milestone markets.
  - Stat abbreviations EXACTLY match: ${player.stats?.map((s) => s.abbr).join(", ")}.
  - Take into consideration opposing teams defensive stats if provided
  - All confidence values within defined ranges.
  - No raw game counts in rationale (e.g., "2/41 games").
  - Hit rates must be expressed as percentages (e.g., "85.3% hit rate").
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
    range: [number, number];
    vsLine: string;
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
            range: p.range || [0, 0],
            vsLine: p.vsLine || "",
            matchupImpact: p.matchupImpact || "",
          })) || [],

        wateredBetRecommendation:
          parsed.wateredBetRecommendation?.map((b) => ({
            market: b.market,
            recommendation: b.recommendation,
            edge: b.edge,
            confidence: Math.min(100, Math.max(97, b.confidence)), // Enforce watered confidence
            sportsbookLines: b.sportsbookLines || [],
            rationale: b.rationale,
          })) || [],

        bettingSlipRecommendation:
          parsed.bettingSlipRecommendation?.map((b) => ({
            market: b.market,
            recommendation: b.recommendation,
            confidence: Math.min(100, Math.max(72, b.confidence)), // Enforce betslip range
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
