export const getMode = (data: number[]): number[] => {
    if (data.length === 0) return [];
  
    const frequency: Record<number, number> = {};
    data.forEach((value) => (frequency[value] = (frequency[value] || 0) + 1));
  
    const maxFrequency = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter((key) => frequency[+key] === maxFrequency)
      .map(Number);
  };
  