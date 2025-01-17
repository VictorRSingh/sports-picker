export type Game = {
  gameUrl: string;
  home: {
    team: string;
    short: string;
    spread: string;
    moneyline: string;
    total: string;
  };
  away: {
    team: string;
    short: string;
    spread: string;
    moneyline: string;
    total: string;
  };
};
