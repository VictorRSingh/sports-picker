import { Team } from "@/types/Team";
import React from "react";

const PlayerProjections = (props: { data: any; selectedTeam: Team }) => {
  const confidenceColor = (confidence: any) => {
    if (confidence >= 75) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };


  const betColor = (bet: any) => {
    switch (bet) {
      case "UNDER":
        return "text-red-500";
      case "OVER":
        return "text-green-500";
      case "NO BET":
        return "text-neutral-700";
    }
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg space-y-8 w-full">
      {/* Projections Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Player Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {props.data.projections
            ?.sort((a: any, b: any) => b.projection - a.projection)
            .map((proj: any, index: number) => (
              <div
                key={proj.stat}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {proj.stat}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-600 font-bold text-xl">
                    Projection: {proj.projection}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {props.selectedTeam.name && `"${proj.matchupImpact}"`}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* BettingSlip Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Betting Slip Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {props.data.recommendations
            .sort((a: any, b: any) => b.confidence - a.confidence)
            .map((bet: any, index: number) => (
              <div
                key={bet.market}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {bet.market}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-xl text-black font-bold">
                    Recommended: {bet.recommendation}
                  </p>
                  <p
                    className={`font-bold text-lg italic ${confidenceColor(
                      bet.confidence
                    )}`}
                  >
                    {bet.confidence}% Confidence
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "{bet.reasoning}"
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Watered Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Watered/High Confidence Bets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {props.data.wateredBets
            .sort((a: any, b: any) => b.confidence - a.confidence)
            .map((bet: any, index: number) => (
              <div
                key={bet.market}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {bet.market}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-xl text-black font-bold">
                    Alternate Line: {bet.alternate}
                  </p>
                  <p
                    className={`font-bold text-lg italic ${confidenceColor(
                      bet.confidence
                    )}`}
                  >
                    {bet.confidence}% Confidence
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {bet.reasoning}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Exploitable Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Exploitable Lines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {props.data.exploitableLines.map((bet: any, index: number) => (
            <div
              key={bet.market}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {bet.market}
                </h3>
              </div>
              <div className="space-y-2">
                <p className={`font-bold text-lg text-black`}>
                  Sportsbook: {bet.sportsbookLine}
                </p>
                <p className="text-xl text-blue-600 font-bold">
                  Projected: {bet.aiProjection}
                </p>
                <p
                    className={`font-bold text-lg italic ${confidenceColor(
                      bet.confidence
                    )}`}
                  >
                    {bet.confidence}% Confidence
                  </p>
                <p className={`font-bold text-lg ${betColor(bet.bet)}`}>
                  <span>
                    {bet.difference} {bet.bet}
                  </span>
                </p>
                <p className="text-sm text-gray-600 italic">{bet.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerProjections;
