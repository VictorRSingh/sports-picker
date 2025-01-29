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
      ? `\n${selectedTeam.name} defense:\n${JSON.stringify(teamStats)}`
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
          "» Strategy: Alternate milestone lines only\n» Targets: Whole numbers (e.g., 20+ pts, 5+ ast)\n» Confidence: 97-100% required",
      }[selectedBettingStyle]
    }

  # Analysis Requirements
  1. PROJECTION MODEL
  - Weights: Recent 20% | Season 40% | Matchup 20% | Style 20%
  - Use **median value** for all calculations (never mean).
  - Validate stats against: [${player.stats?.map((s) => s.abbr).join(", ")}]

  2. WATERED BET RULES (97-100% CONFIDENCE)
  - **Exclusive to milestone markets**: Whole numbers only (e.g., 20+ pts, 10+ reb).
  - **Must be an alternate line**, not the player's standard sportsbook line.
  - Minimum **1 recommendation required** (if possible).
  - Dynamically generate milestone lines by **rounding down** from the projected value.
  - Requirements:
    • Season-long **hit rate ≥75%** (lowered from 80%).
    • Sample size ≥10 games.
    • Confidence strictly between **97-100%**.
    • No matchup data? Use season-long and last 10-game form instead.
    
  - 🔹 **Dynamic Milestone Line Calculation**
    - **Find the player’s projection** (e.g., **22.5 PPG**).
    - **Round down** to the nearest whole milestone (**20+ pts**).
    - If **hit rate ≥75%**, include the bet.
    - If **not enough confidence**, check **the next lower milestone** (e.g., **15+ pts**).
    
  - Prioritization order:
    1. **Player-team history** (if available).
    2. **Current form (last 10 games)**.
    3. **Season-long performance**.
    
  - Reject only if:
    • No milestone achieves **≥75% hit rate**.
    • Confidence <97%.
    • The milestone line **is the same as the player’s standard line**.

3. BETTING SLIP RULES (PLAYER'S STANDARD LINE ONLY) 
- **Strictly use the standard sportsbook line (e.g., 25.5 pts, 9.5 ast).**
- Minimum **1 recommendation required** (if valid).
- Confidence is derived from the **player’s historical performance**.
- Requirements:
  • **Hit rate = (Games over the sportsbook line) / (Total recent games played) × 100**.
  • Hit rate **≥70%**.
  • Sample size **≥10 games**.
  • Confidence **strictly between 72-96.9%**.
  • If no matchup data is available, use **season-long and last 10-game form instead**.

- 🔹 **New Explicit Confidence Calculation Formula**
  - **Hit rate (%) = (Games above the sportsbook line) / (Total games played) × 100**
  - **Confidence Bracket:**
    - **97%+ → Watered Bets (alternate milestones only)**
    - **90-96.9% → 95% confidence**
    - **80-89.9% → 85% confidence**
    - **70-79.9% → 75% confidence**
    - **Below 70% → Reject betting slip recommendation**

- 🔹 **Fallback Rule:**
  - If no exact sportsbook line exists, select the **closest decimal sportsbook line** that is:
    - Above the player's projection (e.g., **26.5 pts for a 26 PPG projection**).
    - If that line doesn’t exist, take the **nearest below projection**.

- Prioritization order:
  1. **Player-team history** (if available).
  2. **Current form (last 10 games)**.
  3. **Season-long performance**.

- Reject only if:
  • No sportsbook line exists in playerProps.
  • Confidence overlaps with Watered Bets (**97%+**).
  
  # Output Constraints
  - **Mutually exclusive arrays**: 
    • Watered bets use only milestone alternative lines.
    • Betting slip uses only the player's standard sportsbook line.
  - No confidence overlap.
  - Watered bets must use whole-number milestones (e.g., 20+ pts).
  - Betting slip must use decimal sportsbook lines (e.g., 15.5 pts).
  - Stat abbreviations must match: [${player.stats?.map((s) => s.abbr).join(", ")}].

  # Expected Output
  \`\`\`json
  {
    "projections": [ {
      "stat": "<playerStat>",
      "projection": <medianProjection>,
      "matchupImpact": "<rationale>"
    }],

    "wateredBetRecommendation": [ {
      "market": "<MILESTONEMARKET>", // e.g., "PTS"
      "recommendation": "<Over/Under> <whole number>",
      "edge": <boostedEdge>,
      "confidence": 97.0-100.0,
      "rationale": "<% hit rates + matchup logic>"
    }],

    "bettingSlipRecommendation": [ {
      "market": "<STANDARDMARKET>", // e.g., "PTS"
      "recommendation": "<Over/Under> <decimal>",
      "confidence": 72.0-96.9,
      "rationale": "<median vs line + matchup>"
    }]
  }
  \`\`\`

  # Validation Checks
  - 🔴 Reject output if:
    1. Betting slip includes a milestone (e.g., 20+ pts)
    2. Watered bet uses the standard sportsbook line (e.g., 15.5 pts)
    3. Confidence tiers overlap (e.g., 97% in betting slips)
  - 🟢 Accept only if:
    1. Watered bets use whole-number milestone markets (20+ pts).
    2. Betting slips use only the **exact sportsbook line** (15.5 pts).
    3. Confidence levels stay strictly within their designated range.
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
