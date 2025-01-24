import React from "react";

const PlayerProjections = (props: { data: any }) => {
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
      default:
        return "bg-white";
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-8 w-full">
      {/* Projections Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Player Projections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {props.data.projections.map((proj: any, index: number) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {proj.stat}
                </h3>
                <span
                  className={`text-sm font-medium ${confidenceColor(
                    proj.confidence
                  )}`}
                >
                  {proj.confidence}% Confidence
                </span>
              </div>
              <div className="space-y-2">
                {/* <p className="text-sm">
                  <span className="font-medium">Current Line:</span>
                  {proj.currentLine || "N/A"}
                </p> */}
                <p className="text-blue-600 font-bold text-xl">
                  Projection: {proj.projection}
                </p>
                <p className="text-sm text-gray-600 italic">
                  "{proj.matchupLeverage}"
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📈 Trend:</span>
                  {proj.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Betting Recommendations
        </h2>
        <div className="space-y-3">
          {props.data.betRecommendations.map((bet: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${betTypeColor(bet.type)}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    {bet.market}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    {bet.type}
                  </span>
                </div>
                <span className="font-bold text-green-600">
                  +{bet.edge} Edge
                </span>
              </div>
              <p className="text-sm text-gray-600">{bet.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerProjections;
