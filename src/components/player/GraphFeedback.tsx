import React from "react";

interface GraphFeedbackProps {
    columnData: number[];
    overUnder: number;
    playerAverage: number;
}

const GraphFeedback = ({columnData, overUnder, playerAverage}: GraphFeedbackProps) => {
  // Calculate hits and percentage based on filtered columnData
  const hits = columnData.filter((value) => value >= overUnder).length;
  const hitPercentage =
    columnData.length > 0
      ? ((hits / columnData.length) * 100).toFixed(2)
      : "0.00";

  return (
    <div>
      <p>
        Current Line Hits: {hits} {`(${hitPercentage}%)`}
      </p>
      <p>Player Average: {playerAverage.toFixed(2)}</p>
      <p>Standard Deviation: {calculateStandardDeviation(columnData).toFixed(2)}</p>
      <p>Expected: {calculateExpectedPerformance(columnData).toFixed(2)}</p>
    </div>
  );
};

export default GraphFeedback;


function calculateStandardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0; // Handle empty array case

    // Step 1: Calculate the mean
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    // Step 2: Calculate the variance
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;

    // Step 3: Standard deviation is the square root of the variance
    return Math.sqrt(variance);
}

function calculateExpectedPerformance(stats: number[]): number {
    // Automatically generate weights (1 for the oldest, N for the most recent)
    const weights = stats.map((_, index) => index + 1); // [1, 2, 3, ..., stats.length]

    // Calculate the total weighted stats
    const totalWeightedStats = stats.reduce((sum, stat, index) => sum + stat * weights[index], 0);

    // Calculate the total weights
    const totalWeights = weights.reduce((sum, weight) => sum + weight, 0);

    // Return the weighted average
    return totalWeightedStats / totalWeights;
}