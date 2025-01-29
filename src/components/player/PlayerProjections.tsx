import { Team } from "@/types/Team";
import React from "react";

const PlayerProjections = (props: { data: any, selectedTeam: Team }) => {
  const confidenceColor = (confidence: any) => {
    if (confidence >= 75) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const betTypeColor = (type: any) => {
    switch (type) {
      case "Aggressive":
        return "bg-red-100 border-red-300";
      case "Normal":
        return "bg-blue-100 border-blue-300";
      case "Passive":
        return "bg-gray-100 border-gray-300";
      case "Watered":
        return "bg-gray-100 border-gray-300";
      default:
        return "bg-white";
    }
  };

  const edgeColor = (edge: any) => {
    switch (edge) {
      case "LOW":
        return "text-red-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HIGH":
        return "text-green-500";
      case "NEGATIVE":
        return "text-neutral-700";
      case "POSITIVE":
        return "text-green-500";
    }
  };

  console.log(props.data);

  return (
    <div className="p-3 bg-gray-50 rounded-lg space-y-8 w-full">
      {/* Projections Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Player Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {props.data.projections.map((proj: any, index: number) => (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {props.data.bettingSlipRecommendation.map(
            (bet: any, index: number) => (
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
                <p className="text-sm text-gray-600 italic">
                    "{bet.recommendation}"
                  </p>
                  <p
                    className={`font-bold text-lg italic ${confidenceColor(
                      bet.confidence
                    )}`}
                  >
                    {bet.confidence}% Confidence
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "{bet.rationale}"
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Watered Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Watered/High Confidence Bets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {props.data.wateredBetRecommendation.map(
            (bet: any, index: number) => (
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
                  <p
                    className={`font-bold text-lg italic ${confidenceColor(
                      bet.confidence
                    )}`}
                  >
                    {bet.confidence}% Confidence
                  </p>
                  <p className="text-xl text-gray-600 font-bold">
                    {bet.recommendation}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {bet.rationale}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProjections;
