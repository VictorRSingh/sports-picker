import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { difference } from "next/dist/build/utils";

export type Projection = {
  stat: string;
  projection: number;
  matchupImpact: string;
};

export type WateredBet = {
  market: string;
  confidence: number;
  alternate: number;
  reasoning: string;
};

export type RecommendedBet = {
  market: string;
  confidence: number;
  recommendation: number;
  reasoning: string;
};

export type ExploitableLines = {
  market: string;
  sportsbookLine: number;
  aiProjection: number;
  difference: string;
  bet: string;
  reasoning: string;
}


export function useAiResponse() {
  const genAI = new GoogleGenerativeAI("AIzaSyA3nMt9_5UiaPVevkUYavZEpuPeIZFAWrc");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b-exp-0924" });

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

      const parsed = JSON.parse(formattedResponse);
 
      setResponse({
        projections: parsed.projections?.map((p: Projection) => ({
          stat: p.stat,
          projection: p.projection,
          matchupImpact: p.matchupImpact || "",
        })) || [],
        wateredBets: parsed.wateredBets?.map((bet: WateredBet) => ({
          market: bet.market,
          confidence: bet.confidence,
          alternate: bet.alternate,
          reasoning: bet.reasoning,
        })) || [],
        recommendations: parsed.recommendations?.map((rec: RecommendedBet) => ({
          market: rec.market,
          confidence: rec.confidence,
          recommendation: rec.recommendation,
          reasoning: rec.reasoning,
        })) || [],
        exploitableLines: parsed.exploitableLines?.map((exp: ExploitableLines) => ({
          market: exp.market,
          sportsbookLine: exp.sportsbookLine,
          aiProjection: exp.aiProjection,
          difference: exp.difference,
          bet: exp.bet,
          reasoning: exp.reasoning
        })) || []
      });

    } catch (error) {
      console.error("Processing Error", error);
    }
  };

  return { response, fetchAiResponse };
}
