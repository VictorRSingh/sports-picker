export const getStandardDeviation = (data: number[]): number => {
    if (data.length === 0) return 0;
  
    // Step 1: Calculate the mean
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  
    // Step 2: Calculate the squared differences from the mean
    const squaredDifferences = data.map((value) => Math.pow(value - mean, 2));
  
    // Step 3: Calculate the mean of the squared differences
    const meanOfSquaredDifferences =
      squaredDifferences.reduce((sum, value) => sum + value, 0) / data.length;
  
    // Step 4: Return the square root of the mean of squared differences
    return Math.sqrt(meanOfSquaredDifferences);
  };
  