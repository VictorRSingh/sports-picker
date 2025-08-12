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
  // const [AIResponse, setAIResponse] = useState<{
  //   projections: Projection[];
  //   recommendations: RecommendedBet[];
  //   wateredBets: WateredBet[];
  //   exploitableLines: ExploitableLines[];
  // } | null>(null);

  // const [AIPrompt, setAIPrompt] = useState<string>();
  // const { response, fetchAiResponse } = useAiResponse();

  // const pathname = usePathname();
  // const sport = pathname
  //   .split("/")[2]
  //   .toUpperCase() as keyof (typeof alternateLines)[0];
  // const { teams } = useTeam(pathname.replace("/p", "").split("/")[1]);
  // const { teamStats, fetchTeamStats } = useTeamStats();
  // const [selectedTeam, setSelectedTeam] = useState<Team>({
  //   name: "",
  //   image: "",
  //   sport: "",
  //   webUrl: "",
  // });

  // const [selectedBettingStyle, setSelectedBettingStyle] =
  //   useState<BettingStyleEnum>(BettingStyleEnum.normal);

  // const [extraDetails, setExtraDetails] = useState<string[]>([]);
  // const pPlayerMarkets =
  //   playerProps &&
  //   playerProps.flatMap((prop) => prop.market.replace("Odds", ""));
  // const pAlternateMarkets = alternateLines[0][sport];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (selectedTeam) {
  //       await fetchTeamStats(selectedTeam.sport); // Fetch the team stats
  //     }
  //   };

  //   fetchData();
  // }, [selectedTeam]);

  // useEffect(() => {
  // }, [AIResponse])

  // useEffect(() => {
  //   if (player && gameLogs) {
  //     const prompt = `
  //     You are a sports betting analyst for ${sport} evaluating ${player.name}. Use ONLY the following data and rules:
      
  //     ## 📊 DATA SOURCES
  //     - Game Logs: ${JSON.stringify(gameLogs)}
  //     - Markets to Project: ${JSON.stringify(pPlayerMarkets)}
  //     - Sportsbook Lines: ${JSON.stringify(playerProps)}
  //     - Alternate Lines: ${JSON.stringify(pAlternateMarkets)}
  //     ${selectedTeam.name ? `- Opponent Defense: ${JSON.stringify(teamStats!.rows.find(r => r.columns[0].text.includes(selectedTeam.name)))}` : ''}
      
  //     ## 🎯 PROJECTION RULES
  //     1. For EACH market in pPlayerMarkets:
  //        a. Calculate MEDIAN of ALL games 
  //        (${JSON.stringify(gameLogs.headers)})
  //        (${JSON.stringify(gameLogs)})
  //        b. Calculate MEDIAN of LAST RECENT 5 games: 
  //        (${JSON.stringify(gameLogs.headers)})
  //        (${JSON.stringify(gameLogs.rows.slice(0, 5))})
  //        c. Final Projection = Weighted Average:
  //           (SeasonMedian * 0.6) + (Recent5Median * 0.4)
            
  //        d. Confidence = (% of games where player hit ≥ Final Projection) * 100
  //           - If Confidence < 80%: 
  //              i. Reduce projection by 0.5 increments
  //             ii. Recalculate Confidence
  //            iii. Repeat until Confidence ≥ 90%
  //        e. For NBA: Do not confused FG(Field Goals) for 3FG (Three's Field Goals)
      
      
  //     ## 💰 BET RECOMMENDATION RULES
  //     For EACH sportsbook line in ${JSON.stringify(playerProps)}:
  //     1. Calculate Edge = (Projection - SportsbookLine) / SportsbookLine * 100
  //     2. Recommendation:
  //        - OVER if Edge ≥ +5% AND Confidence ≥75%
  //        - UNDER if Edge ≤ -5% AND Confidence ≥75%
  //        - NO BET otherwise
  //     3. Required in output:
  //        - Confidence must be ≥75%
  //        - Clear math showing Edge calculation
  //     4. Filter out any "NO BET" recommendations
      
  //     ## 🎯 EXPLOITABLE LINES RULES
  //     1. For EACH sportsbook line:
  //        a. Calculate Value Gap = ((Projection - SportsbookLine) / SportsbookLine) * 100
  //        b. Requirements:
  //           - OVER if Value Gap ≥ +8% AND Confidence ≥70%
  //           - UNDER if Value Gap ≤ -8% AND Confidence ≥70%
  //           - NO BET if between -8% to +8%
  //        c. Must show:
  //           - Original sportsbook line
  //           - AI projection comparison
  //           - Gap percentage
      
  //     ## 🚰 WATERED BETS RULES  
          
  //     **Task:** Identify the highest confidence alternate lines for each stat from the given game logs, ensuring strict hit rate conditions.  
          
  //     ### **Processing Steps:**  
  //     1. **Sort** alternate lines **in descending order**.  
  //     2. **For each alternate line in the sorted list:**  
  //        - Calculate the **exact hit rate** (number of games meeting or exceeding the line).  
  //        - Validate against **strict conditions**:  
  //          - Line **must be < projection**.  
  //          - **High Confidence**: ≥80% hit rate (**8/10 games**).  
  //          - **Medium Confidence**: ≥70% hit rate (**7/10 games**).  
  //          - **Low Confidence**: ≥60% hit rate (**6/10 games**).  
  //     3. **Use all game logs** for calculations (**Total Games: \${gameLogs.rows.length}**).  
  //     4. **Selection Priority:**  
  //        - **First:** Highest line with **≥80% hit rate**.  
  //        - **Second:** Next highest with **≥70% hit rate**.  
  //        - **Third:** Highest line with **≥60% hit rate**.  
          
  //     ### **Anti-Error Measures:**  
  //     - **Double-check** actual game log numbers against the line.  
  //     - **Reject** any line where **projection < line**.  
  //     - **Flag discrepancies** >15% between calculated and claimed hit rates.  
          
  //     **Example Output Format:**  
          
  //     **🚰 Watered/High Confidence Bets**  
  //     **Assists**  
  //     - **Alternate Line:** 8  
  //     - **Hit Rate:** 90% (9/10 games)  
          
  //     **Rebounds**  
  //     - **Alternate Line:** 8  
  //     - **Hit Rate:** 60% (6/10 games)  
          
  //     ## 📝 REQUIRED OUTPUT
  //     \`\`\`json
  //     {
  //       "projections": [
  //         {
  //           "market": "Points",
  //           "medianProjection": 22.5,
  //           "confidence": 92,
  //           "calculationSteps": "Season Median: 22.0 | Last5 Median: 23.5 | Weighted: 22.6 → Adjusted to 22.5 for 90% confidence"
  //         }
  //       ],
  //       "recommendations": [
  //         {
  //           "market": "Points",
  //           "sportsbookLine": 21.5,
  //           "recommendation": "OVER",
  //           "confidence": 92,
  //           "edge": "+4.65%",
  //           "math": "(22.5-21.5)/21.5 = +4.65%"
  //         }
  //       ],
  //       "exploitableLines": [
  //         {
  //           "market": "Points",
  //           "sportsbookLine": 19.5,
  //           "aiProjection": 22.5,
  //           "difference": "+15.38%",
  //           "bet": "OVER",
  //           "reasoning": "Sportsbook line 19.5 vs AI 22.5 (+15.4% gap)",
  //           "confidence": 92
  //         }
  //       ],
  //       "wateredBets": [
  //         {
  //           "market": "Points",
  //           "hitRate": 85,
  //           "hitRateDetails: "(7/10 games)"
  //           "alternateLine": 20,
  //           "projectionComparison": "22.5 vs 20"
  //         }
  //       ]
  //     }
  //     \`\`\`
      
  //     ## ⚠️ STRICT VALIDATION
  //     - REJECT any projection using mean averages
  //     - FLAG any confidence calculations using normal distribution
  //     - VERIFY all medians against raw game logs
  //     - ENFORCE 0.5 increment adjustments for confidence
  //     - DOUBLE-CHECK matchup data aligns with ${selectedTeam.name} stats
  //     `;
  //     // ## VALIDATION EXAMPLE: LEBRON JAMES LAST 10
  //     // Assists Log: ${JSON.stringify([8,8,12,9,8,6,11,13,5,7])}
  //     // Rebounds Log: ${JSON.stringify([7,11,3,8,7,14,10,5,7,6])}
  //     if (prompt) {
  //       setAIPrompt(prompt);
  //     }
  //   }
  // }, [player, gameLogs]);

  // useEffect(() => {
  //   if (AIPrompt) {
  //     fetchAiResponse(AIPrompt);
  //   }
  // }, [AIPrompt]);

  // useEffect(() => {
  //   if (response) {
  //     setAIResponse(response);
  //   }
  // }, [response]);

  // return (
  //   <div className="flex flex-col lg:flex-row h-full">
  //     {teams && selectedTeam && setSelectedTeam && (
  //       <div className="flex flex-col gap-x-2 min-w-60 lg:max-w-60">
  //         <AiPromptsFilter
  //           player={player}
  //           teams={teams}
  //           selectedTeam={selectedTeam}
  //           setSelectedTeam={setSelectedTeam}
  //           selectedBettingStyle={selectedBettingStyle}
  //           setSelectedBettingStyle={setSelectedBettingStyle}
  //           extraDetails={extraDetails}
  //           setExtraDetails={setExtraDetails}
  //           AIResponse={AIResponse!}
  //           setAiResponse={setAIResponse}
  //           fetchAiResponse={fetchAiResponse!}
  //           AiPrompt={AIPrompt!}
  //         />
  //       </div>
  //     )}

  //     {AIResponse && AIResponse?.projections.length > 0 ? (
  //       <div className="mt-4">
  //         <PlayerProjections data={AIResponse} selectedTeam={selectedTeam} />
  //       </div>
  //     ) : (
  //       <div className="flex justify-center items-center w-full h-full">
  //         <div className="flex flex-col gap-y-2 h-full items-center justify-center">
  //           <div className="flex items-center gap-x-2">
  //             <span>Loading AI Projections...</span>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="">Ai Prompts</div>
  )
};

export default AiPrompts;
