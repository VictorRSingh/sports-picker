export const calculateDeviation = (stat: number[]): number => {
    const N = stat.length;
  
    if (N === 0) return 0; // Handle case for empty input array
  
    // Step 1: Calculate the mean
    const mean = stat.reduce((sum, value) => sum + value, 0) / N;
  
    // Step 2: Calculate the variance
    const variance = stat.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / N;
  
    // Step 3: Return the square root of the variance (standard deviation)
    return Math.sqrt(variance);
  };