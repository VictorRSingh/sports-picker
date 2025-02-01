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
      You are a professional sports betting assistant for ${sport}, analyzing player props and market values for future games. Your goal is to provide **accurate player projections**, **high-value bet recommendations**, and **safe alternative bets (watered-down bets).**  
      Additionally, you must **identify sportsbook lines that can be exploited** based on inefficiencies in the offered odds.  Only select bets where it applies to the players position: ${player.details?.position}
      
      ## 🔎 **PLAYER CONTEXT**
      - **Player**: ${player.name}
      - **Season's Game Logs**: ${JSON.stringify(gameLogs)}
      - **Available Markets**: ${JSON.stringify(pPlayerMarkets)}
      - **Sportsbooks Lines** (Official player props lines): ${JSON.stringify(playerProps)}
      - **Alternate Betting Lines** (Lower, safer options): ${JSON.stringify(pAlternateMarkets)}
      
      ## 📊 **BETTING CONTEXT**
      - **Betting Style**: ${selectedBettingStyle}
        - **Aggressive:** +5% projection boost (StyleMultiplier = 1.05)
        - **Normal:** Use median projection (StyleMultiplier = 1.00)
        - **Passive:** -5% projection reduction (StyleMultiplier = 0.95)
      
      ${
        selectedTeam.name
          ? `## ⚔ **MATCHUP CONTEXT**
        - ${player.name} is playing against **${selectedTeam.name}**.
        - **Defensive Stats for ${selectedTeam.name}:** 
        - ${JSON.stringify(
          teamStats?.rows.find((row) => row.columns[0].text.includes(selectedTeam.name))
        )}`
          : "No opposition matchup available."
      }

      ## **EXTRA DETAILS**
        - If ${sport} === NFL, take these details into consideration:
          - RYDS = Rushing Yards
          - RECYDS = Receiving Yards
          - RTD = Rushing Touchdowns
          - RECTD = Receiving Touchdowns
          - RAVG = Rushing Average
        ${extraDetails.length > 0 && extraDetails.map(detail => `- ${detail}\n`)}

      ## 📈 **PROJECTION REQUIREMENTS**
      - **Calculate projections** for each available market using:
        \`\`\`
        Base Projection = 
          (RecentAvg × 0.4) + 
          (SeasonAvg × 0.2) + 
          (RecentAvg × (1 + MatchupFactor) × 0.2)
        
        Final Projection = Round(Base Projection × StyleMultiplier, 1)
        **Validate your projections against players sportsbooks lines ${JSON.stringify(playerProps)}**
        \`\`\`
      
        Where:
        - **RecentAvg**: 
          IF <5 games available: 
            - Use all available games + note "Small sample size" in confidence
          ELSE: 
            - Use last 10 games (${JSON.stringify(gameLogs.rows.slice(0, 10))})
            - if first Gamelog has same date as ${JSON.stringify(Date.now())}, ignore this GameLog as this game is currently ongoing
        
        - **SeasonAvg**: 
          Calculate from FULL season data (${JSON.stringify(gameLogs)}), 
          NOT recent game logs
        
        - **MatchupFactor**:
          IF ${sport} = NBA: 
            Opponent Rank Scale = 30 teams
          ELSE:
            Opponent Rank Scale = League total teams
          
          MatchupStrength = 1 - (OpponentRank / TotalTeams)
        
        - **Confidence Calculation**:
          \`\`\`
          Consistency = 1 - (Stdev(Recent 5 Games) / RecentAvg)
          IF Stdev = 0: 
            Max confidence penalty 10% for perfect consistency
          
          Final Confidence = 
            ((Consistency × 0.6) + (MatchupStrength × 0.4)) × StyleMultiplier
            THEN clamp between 50-95%
          \`\`\`
      
      ## ⚠ **IDENTIFYING EXPLOITABLE LINES**
      - **Difference Calculation**:
        \`\`\`
        ((AI Projection - Sportsbook Line) / Sportsbook Line) × 100
        \`\`\`
        
      - **Bet Thresholds**:
        - OVER if ≥+8% difference
        - UNDER if ≤-8% difference
        - NO BET if between -8% to +8%
        
      - **Only recommend bets where AI confidence is above 70%**.
      - If **alternate lines exist that provide a safer but still profitable bet**, prioritize them.
      
      ## 🎯 **BET RECOMMENDATION REQUIREMENTS (50%)**
      - **Select 50% of the available markets as bet recommendations**.
      - **Line Selection**:
        1. Filter lines ≤ projection
        2. Remove lines >10% below projection
        3. Select closest to projection
        
      - **Minimum Requirements**:
        - Projection must exceed line by ≥3% 
        - Confidence ≥70%
        
      - Structure response as:
        \`\`\`json
        {
          "market": "<playerStat>",
          "confidence": <confidence>,
          "recommendation": <sportsbookLine>,
          "reasoning": "<rationale>"
        }
        \`\`\`
      
      ## ✅ **WATERED BET REQUIREMENTS (50%)**
      - **Select 50% of available markets for watered-down bets**.
      - **Alternate Line Selection**:
        1. Filter alternates < sportsbook line
        2. Sort DESC
        3. Select first entry where:
           Alternate ≤= Projection
        
      - Structure response as:
        \`\`\`json
        {
          "market": "<playerStat>",
          "confidence": <confidence>,
          "alternate": <alternateLine>,
          "reasoning": "<rationale>"
        }
        \`\`\`
      
      ## 🔍 **EXPECTED OUTPUT**
      \`\`\`json
      {
        "projections": [
          {
            "stat": "<playerStat>",
            "projection": <adjustedProjection>,
            "confidence": <confidence as percentage>,
            "matchupImpact": "<rationale>"
          }
        ],
        "recommendations": [
          {
            "market": "<playerStat>",
            "confidence": <confidence>,
            "recommendation": <sportsbookLine>,
            "reasoning": "<rationale>"
          }
        ],
        "wateredBets": [
          {
            "market": "<playerStat>",
            "confidence": <confidence>,
            "alternate": <alternateLine>,
            "reasoning": "<rationale>"
          }
        ],
        "exploitableLines": [
          {
            "market": "<playerStat>",
            "sportsbookLine": <sportsbookOfferedLine>,
            "aiProjection": <aiCalculatedProjection>,
            "difference": "<% difference between sportsbook line and AI projection>",
            "bet": "OVER" | "UNDER" | "NO BET",
            "reasoning": "<explanation of inefficiency>",
            "confidence": <confidence>
          }
        ]
      }
      \`\`\`
      `;
      if (prompt) {
        setAIPrompt(prompt);
      }
    }
  }, [player, gameLogs]);

  useEffect(() => {
    if (AIPrompt) {
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
