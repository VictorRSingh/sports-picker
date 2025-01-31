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

    console.log(JSON.stringify(
      teamStats?.rows.find((row) => row.columns[0].text.includes(selectedTeam.name))
    ))
  }, [selectedTeam]);

  useEffect(() => {
    console.log("AIResponse", AIResponse)
  }, [AIResponse])

  useEffect(() => {
    if (player && gameLogs) {
      const prompt = `
      You are a professional sports betting assistant for ${sport}, analyzing player props and market values for future games. Your goal is to provide **accurate player projections**, **high-value bet recommendations**, and **safe alternative bets (watered-down bets).**  
      Additionally, you must **identify sportsbook lines that can be exploited** based on inefficiencies in the offered odds.
      
      ## 🔎 **PLAYER CONTEXT**
      - **Player**: ${player.name}
      - **Recent Game Logs**: ${JSON.stringify(gameLogs)}
      - **Available Markets**: ${JSON.stringify(pPlayerMarkets)}
      - **Sportsbooks Lines** (Official player props lines): ${JSON.stringify(playerProps)}
      - **Alternate Betting Lines** (Lower, safer options): ${JSON.stringify(pAlternateMarkets)}
      
      ## 📊 **BETTING CONTEXT**
      - **Betting Style**: ${selectedBettingStyle}
        - **Aggressive:** +5% projection boost.
        - **Normal:** Use median projection.
        - **Passive:** -5% projection reduction.
      
      ${
        selectedTeam
          ? `## ⚔ **MATCHUP CONTEXT**
        - ${player.name} is playing against **${selectedTeam.name}**.
        - **Defensive Stats for ${selectedTeam.name}:** 
        - ${JSON.stringify(
          teamStats?.rows.find((row) => row.columns[0].text.includes(selectedTeam.name))
        )}`
          : "No opposition matchup available."
      }
      
      ## 📈 **PROJECTION REQUIREMENTS**
      - **Calculate projections** for each available market based on:
        - **40% Weight** → Recent Game Averages
        - **20% Weight** → Season Averages
        - **20% Weight** → Defensive Matchup
        - **20% Weight** → Betting Style Adjustments
      - Provide **confidence ratings** (0-100%) for each market.
      - Include **matchup impact** and reasoning.
      
      ## ⚠ **IDENTIFYING EXPLOITABLE LINES**
      - **Compare AI projections to sportsbook lines.**
      - **Flag any lines where AI projection differs by 8-20% or more from the sportsbook line.**
        - If **AI projection is 8-20%+ higher than the sportsbook line**, recommend **OVER**.
        - If **AI projection is 8-20%+ lower than the sportsbook line**, recommend **UNDER**.
      - **Only recommend bets where AI confidence is above 70%**.
      - If the **sportsbook line is exactly equal to AI's projection**, do not bet.
      - If **alternate lines exist that provide a safer but still profitable bet**, prioritize them.
      
      ## 🎯 **BET RECOMMENDATION REQUIREMENTS (50%)**
      - **Select 50% of the available markets as bet recommendations.**
      - **Find the closest sportsbook line that is BELOW or equal to the AI projection.**
      - **DO NOT** pick a sportsbook line that is **above** the AI projection.
      - Prioritize bets where **confidence is >80%** and the sportsbook line is inefficient.
      - Structure response as:
        - market: Name of the stat.
        - confidence: Confidence percentage.
        - recommendation: The **closest sportsbook line that is below or equal to the projection**.
        - reasoning: Explanation of why this bet is valuable.
      
      ## ✅ **WATERED BET REQUIREMENTS (50%)**
      - **Select 50% of available markets for watered-down bets.**
      - **WAtered Bets alternate line CANNOT be higher than sportsbooks line.**
      - **Find the closest alternate line that is BELOW the sportsbook line.**
      - **DO NOT pick an alternate line that is above the sportsbook line.**
      - **Prioritize stats that appear most frequently in GameLogs (most data available).**
      - **Watered bets must reduce risk but maintain confidence above 80%.**
      - Structure response as:
        - market: Name of the stat.
        - confidence: Confidence percentage.
        - alternate: The **highest available alternate line that is still below the sportsbook line**.
        - reasoning: Explanation for choosing the alternate.
      
      ## 🔍 **EXPECTED OUTPUT**
      \`\`\`json
      [
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
            "reasoning": "<explanation of inefficiency>"
          }
        ]
    ]
      \`\`\`
      `
      
;
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
