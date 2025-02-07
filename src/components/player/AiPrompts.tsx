import React, { useEffect, useState } from "react";

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
import {
  ExploitableLines,
  Projection,
  RecommendedBet,
  useAiResponse,
  WateredBet,
} from "@/hooks/useAiResponse";

interface AiPromptsProps {
  gameLogs: Gamelog;
  player: Player;
  playerProps: PlayerProps[];
}

const AiPrompts = ({ gameLogs, player, playerProps }: AiPromptsProps) => {
  const [AIResponse, setAIResponse] = useState<{
    projections: Projection[];
    recommendations: RecommendedBet[];
    wateredBets: WateredBet[];
    exploitableLines: ExploitableLines[];
  } | null>(null);

  const [AIPrompt, setAIPrompt] = useState<string>();
  const exploitableLinePercent = 8;
  const { response, fetchAiResponse } = useAiResponse();

  const pathname = usePathname();
  const sport = pathname
    .split("/")[2]
    .toUpperCase() as keyof (typeof alternateLines)[0];
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
  const pPlayerMarkets =
    playerProps &&
    playerProps.flatMap((prop) => prop.market.replace("Odds", ""));
  const pAlternateMarkets = alternateLines[0][sport];

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTeam) {
        await fetchTeamStats(selectedTeam.sport); // Fetch the team stats
      }
    };

    fetchData();
  }, [selectedTeam]);

  useEffect(() => {
  }, [AIResponse])

  useEffect(() => {
    if (player && gameLogs) {
      const prompt = `
      You are a sports betting analyst for ${sport} evaluating ${player.name}. Use ONLY the following data and rules:
      
      ## 📊 DATA SOURCES
      - Game Logs: ${JSON.stringify(gameLogs)}
      - Markets to Project: ${JSON.stringify(pPlayerMarkets)}
      - Sportsbook Lines: ${JSON.stringify(playerProps)}
      - Alternate Lines: ${JSON.stringify(pAlternateMarkets)}
      ${selectedTeam.name ? `- Opponent Defense: ${JSON.stringify(teamStats!.rows.find(r => r.columns[0].text.includes(selectedTeam.name)))}` : ''}
      
      ## 🎯 PROJECTION RULES
      1. For EACH market in pPlayerMarkets:
         a. Calculate MEDIAN of ALL games 
         (${JSON.stringify(gameLogs.headers)})
         (${JSON.stringify(gameLogs)})
         b. Calculate MEDIAN of LAST RECENT 5 games: 
         (${JSON.stringify(gameLogs.headers)})
         (${JSON.stringify(gameLogs.rows.slice(0, 5))})
         c. Final Projection = Weighted Average:
            (SeasonMedian * 0.6) + (Recent5Median * 0.4)
            
         d. Confidence = (% of games where player hit ≥ Final Projection) * 100
            - If Confidence < 80%: 
               i. Reduce projection by 0.5 increments
              ii. Recalculate Confidence
             iii. Repeat until Confidence ≥ 90%
         e. For NBA: Do not confused FG(Field Goals) for 3FG (Three's Field Goals)
      
      
      ## 💰 BET RECOMMENDATION RULES
      For EACH sportsbook line in ${JSON.stringify(playerProps)}:
      1. Calculate Edge = (Projection - SportsbookLine) / SportsbookLine * 100
      2. Recommendation:
         - OVER if Edge ≥ +5% AND Confidence ≥75%
         - UNDER if Edge ≤ -5% AND Confidence ≥75%
         - NO BET otherwise
      3. Required in output:
         - Confidence must be ≥75%
         - Clear math showing Edge calculation
      
      ## 🎯 EXPLOITABLE LINES RULES
      1. For EACH sportsbook line:
         a. Calculate Value Gap = ((Projection - SportsbookLine) / SportsbookLine) * 100
         b. Requirements:
            - OVER if Value Gap ≥ +8% AND Confidence ≥70%
            - UNDER if Value Gap ≤ -8% AND Confidence ≥70%
            - NO BET if between -8% to +8%
         c. Must show:
            - Original sportsbook line
            - AI projection comparison
            - Gap percentage
      
      ## 🚰 WATERED BETS RULES
      For EACH alternate line in ${JSON.stringify(pAlternateMarkets)}:
      1. Sort alternate lines DESCENDING (highest to lowest)
      2. For EACH line in sorted list:
         a. Calculate EXACT hit rate using LAST 10 GAMES:
            ${JSON.stringify(gameLogs.rows.slice(0, 9))}
         b. Validate STRICT conditions:
            - Line MUST BE < Projection
            - Minimum 8/10 hits (80%) for "High Confidence"
            - Minimum 6/10 hits (60%) for "Medium Confidence"
      3. Selection Priority:
         a. First: Highest line with ≥80% hit rate
         b. Second: Next highest line with ≥70% hit rate
         c. Third: Highest line with ≥60% hit rate
      4. Anti-Error Measures:
         - DOUBLE-CHECK actual game log numbers against line
         - REJECT any line where projection < line
         - FLAG discrepancies >15% between calculated/claimed hit rates

      ## VALIDATION EXAMPLE: LEBRON JAMES LAST 10
      Assists Log: ${JSON.stringify([8,8,12,9,8,6,11,13,5,7])}
      Rebounds Log: ${JSON.stringify([7,11,3,8,7,14,10,5,7,6])}

      Assists Analysis:
      - 8+ assists: 9/10 games (90%)
      - 10+ assists: 3/10 games (30%)

      Rebounds Analysis: 
      - 10+ rebounds: 3/10 games (30%)
      - 8+ rebounds: 6/10 games (60%)
          
      ## 📝 REQUIRED OUTPUT
      \`\`\`json
      {
        "projections": [
          {
            "market": "Points",
            "medianProjection": 22.5,
            "confidence": 92,
            "calculationSteps": "Season Median: 22.0 | Last5 Median: 23.5 | Weighted: 22.6 → Adjusted to 22.5 for 90% confidence"
          }
        ],
        "recommendations": [
          {
            "market": "Points",
            "sportsbookLine": 21.5,
            "recommendation": "OVER",
            "confidence": 92,
            "edge": "+4.65%",
            "math": "(22.5-21.5)/21.5 = +4.65%"
          }
        ],
        "exploitableLines": [
          {
            "market": "Points",
            "sportsbookLine": 19.5,
            "aiProjection": 22.5,
            "difference": "+15.38%",
            "bet": "OVER",
            "reasoning": "Sportsbook line 19.5 vs AI 22.5 (+15.4% gap)",
            "confidence": 92
          }
        ],
        "wateredBets": [
          {
            "market": "Points",
            "hitRate": 85,
            "hitRateDetails: "(7/10 games)"
            "alternateLine": 20,
            "projectionComparison": "22.5 vs 20"
          }
        ]
      }
      \`\`\`
      
      ## ⚠️ STRICT VALIDATION
      - REJECT any projection using mean averages
      - FLAG any confidence calculations using normal distribution
      - VERIFY all medians against raw game logs
      - ENFORCE 0.5 increment adjustments for confidence
      - DOUBLE-CHECK matchup data aligns with ${selectedTeam.name} stats
      `;
      if (prompt) {
        setAIPrompt(prompt);
      }
    }
  }, [player, gameLogs]);

  useEffect(() => {
    if (AIPrompt) {
      console.log(AIPrompt)
      fetchAiResponse(AIPrompt);
    }
  }, [AIPrompt]);

  useEffect(() => {
    if (response) {
      setAIResponse(response);
    }
  }, [response]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {teams && selectedTeam && setSelectedTeam && (
        <div className="flex flex-col gap-x-2 min-w-60 lg:max-w-60">
          <AiPromptsFilter
            player={player}
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            selectedBettingStyle={selectedBettingStyle}
            setSelectedBettingStyle={setSelectedBettingStyle}
            extraDetails={extraDetails}
            setExtraDetails={setExtraDetails}
            AIResponse={AIResponse!}
            setAiResponse={setAIResponse}
            fetchAiResponse={fetchAiResponse!}
            AiPrompt={AIPrompt!}
          />
        </div>
      )}

      {AIResponse && AIResponse?.projections.length > 0 ? (
        <div className="mt-4">
          <PlayerProjections data={AIResponse} selectedTeam={selectedTeam} />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex flex-col gap-y-2 h-full items-center justify-center">
            <div className="flex items-center gap-x-2">
              <span>Loading AI Projections...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiPrompts;
