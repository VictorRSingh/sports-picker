import { GameLog } from "@/interfaces/GameLog";

export const getPlayerPointAverage = (gameLogs: GameLog[]) => {
  return (
    gameLogs.reduce((total, game) => total + game.points!, 0) / gameLogs.length
  );
};

export const getPlayerReboundAverage = (gameLogs: GameLog[]) => {
  return (
    gameLogs.reduce((total, game) => total + game.rebounds!, 0) /
    gameLogs.length
  );
};

export const getPlayerAssistsAverage = (gameLogs: GameLog[]) => {
  return (
    gameLogs.reduce((total, game) => total + game.assists!, 0) / gameLogs.length
  );
};
