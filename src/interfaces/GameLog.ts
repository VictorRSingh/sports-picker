export enum GameResult {
  Win = "Win",
  Lose = "Lose",
}

export interface GameLog {
  date?: string;
  opposition: string;
  winLose: GameResult;
  minutesPlayed?: number;
  points?: number;
  fieldGoals?: {
    made: number;
    taken: number;
  };
  threePointFieldGoals?: {
    made: number;
    taken: number;
  };
  freeThrows?: {
    made: number;
    taken: number;
  };
  offensiveRebounds?: number;
  defensiveRebounds?: number;
  reboundsTotal?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  personalFouls?: number;
  turnovers?: number;
  plusMinus?: number;
  rushingAttempts?: number;
  rushingYards?: number;
  rushingYardsPerAttemptAverage?: number;
  rushingTouchdowns?: number;
  fumbles?: number;
  targets?: number;
  receptions?: number;
  receivingTouchdowns?: number;
  completions?: number;
  passingAttempts?: number;
  completionPercent?: number;
  passingYards?: number;
  passingYardsPerAttemptAverage?: number;
  passingTouchdowns?: number;
  interceptions?: number;
  sacks?: number;
  sackYards?: number;
  receivingYards?: number;
}
