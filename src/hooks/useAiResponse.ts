import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { difference } from "next/dist/build/utils";
import { alternateLines } from "../../public/data/AlternateLines";

export type Projection = {
  market: string;
  medianProjection: number;
  confidence: number;
  calculationSteps: string;
};

export type WateredBet = {
  market: string;
  hitRate: number;
  hitRateDetails: string;
  alternateLine: number;
  projectionComparison: string;
};

export type RecommendedBet = {
  market: string;
  sportsbookLine: number;
  recommendation: string;
  confidence: number;
  edge: string;
  math: string;
};

export type ExploitableLines = {
  market: string;
  sportsbookLine: number;
  aiProjection: number;
  difference: string;
  bet: string;
  reasoning: string;
  confidence: number;
};

export function useAiResponse() {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyA3nMt9_5UiaPVevkUYavZEpuPeIZFAWrc"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite-preview-02-05",
  });

  const [response, setResponse] = useState<{
    projections: Projection[];
    wateredBets: WateredBet[];
    recommendations: RecommendedBet[];
    exploitableLines: ExploitableLines[];
  }>({
    projections: [],
    wateredBets: [],
    recommendations: [],
    exploitableLines: [],
  });

  const fetchAiResponse = async (prompt: string | null) => {
    if (!prompt) return;

    try {
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();

      // Extract JSON from response (assuming Gemini might wrap it in ```json)
      const jsonMatch = rawResponse.match(/```json([\s\S]*?)```/);
      const formattedResponse = jsonMatch ? jsonMatch[1].trim() : rawResponse;
      let parsed = null;

      function sanitizeJsonOutput(jsonString: string) {
        return jsonString
          .replace(/,\s*([\]}])/g, "$1") // Remove trailing commas
          .replace(/NaN|Infinity|-Infinity/g, "null") // Replace invalid numbers
          .replace(/(\r\n|\n|\r)/gm, " "); // Remove newlines
      }

      try {
        const cleanJson = sanitizeJsonOutput(formattedResponse);
        const parsed = JSON.parse(cleanJson);
        // console.log("Valid JSON Parsed:", parsed);

        if(parsed) {
          setResponse({
            projections:
              parsed.projections?.map((p: Projection) => ({
                market: p.market,
                medianProjection: p.medianProjection,
                confidence: p.confidence,
                calculationSteps: p.calculationSteps || ""
              })) || [],
            wateredBets:
              parsed.wateredBets?.map((bet: WateredBet) => ({
                market: bet.market,
                alternateLine: bet.alternateLine,
                hitRate: bet.hitRate,
                hitRateDetails: bet.hitRateDetails,
                projectionComparison: bet.projectionComparison,
              })) || [],
            recommendations:
              parsed.recommendations?.map((rec: RecommendedBet) => ({
                market: rec.market,
                sportsbookLine: rec.sportsbookLine,
                recommendation: rec.recommendation,
                confidence: rec.confidence,
                edge: rec.edge,
                math: rec.math
              })) || [],
            exploitableLines:
              parsed.exploitableLines?.map((exp: ExploitableLines) => ({
                market: exp.market,
                sportsbookLine: exp.sportsbookLine,
                aiProjection: exp.aiProjection,
                difference: exp.difference,
                bet: exp.bet,
                reasoning: exp.reasoning,
                confidence: exp.confidence,
              })) || [],
          });
        }
        
      } catch (error) {
        console.error("JSON Parsing Error:", error);
      }
    } catch (error) {
      console.error("Processing Error", error);
    }
  };

  return { response, fetchAiResponse };
}
