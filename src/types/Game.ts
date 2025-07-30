export type Game = {
  id: string;
  date: string;
  status: string;
  teams: {
    homeTeam: {
      name: string;
      logo: string;
    };
    awayTeam: {
      name: string;
      logo: string;
    };
  };
  location: {
    city: string;
    stadium: string;
  };
  odds: {
    team: string;
    moneyline: number;
  },
  webUrl: string;
};
