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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        Aggressive: "» Focus: Median projection with a +5% boost",
        Normal: "» Focus: Median projection",
        Passive: "» Focus: Median projection with a -5% reduction",
        Watered:
          "» Strategy: Alternate lines only\n» Targets: Sportsbook milestones (e.g., 20+ pts, 5+ ast)\n» Confidence: 97%+ required",
      }[selectedBettingStyle]
    }

  # Analysis Requirements
  1. PROJECTION MODEL
  - Weights: Recent 20% | Season 40% | Matchup 20% | Style 20%
  - Use the **median value** as the central tendency for all calculations.
  - Validate stats against: [${player.stats?.map((s) => s.abbr).join(", ")}]

  2. WATERED BET RULES
  - Minimum 4 recommendations with 97-100% confidence.
  - Include milestone markets (e.g., 20+ pts, 15+ points, 8+ rebounds, under 6.5 rebounds) for stats: [${player.stats?.map((s) => s.abbr).join(", ")}].
  - Prioritize: Player-team history → Current form → Matchup.
  - Reject any bet with:
    • Raw game counts in rationale ("X/Y games").
    • Sample size <10 games.
    • Hit rate <80%.
  - Format: "Projected [value] ([XX.X]% hit rate in [category])".

  3. BETTING SLIP RULES
  - Minimum 3 recommendations with 72-100% confidence.
  - Provide clear rationale without raw game counts.
  - Reject any bet with sample size <10 games or hit rate <70%.

  # Output Constraints
  - Decimals only, no trailing commas.
  - Empty arrays if no matches.
  - Stat abbreviations must match: [${player.stats?.map((s) => s.abbr).join(", ")}].

  # Expected Output
  \`\`\`json
  {
    "projections": [{
      "stat": "<playerStat>",
      "projection": <calculatedProjection>, // Single number value (median-based)
      "matchupImpact": "<rationaleForSpecificMatchup>"
    }],
    
    "wateredBetRecommendation": [{
      "market": "<playerStatMarket>",
      "recommendation": "<altLineRecommendationWithHighConfidence>",
      "edge": <calculatedEdge>,
      "confidence": <calculatedConfidence>,
      "rationale": "<rationale>"
    }],
    
    "bettingSlipRecommendation": [{
      "market": "<playerStatMarket>",
      "recommendation": "<RecommendationWithHighConfidence>",
      "confidence": <calculatedConfidence>,
      "rationale": "<rationale>"
    }]
  }
  \`\`\`

  # Critical Validation
  - Watered bets MUST include milestone markets.
  - No raw game counts in rationale.
  - Hit rates must be expressed as percentages (e.g., "85.3% hit rate").
  - Opposing team defensive stats must be considered if provided.
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
