export const getPlayerAverage = (stat: number[]): number => {
    return stat.reduce((sum, value) => sum + value, 0) / stat.length;
}