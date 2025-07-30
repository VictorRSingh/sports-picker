export type Standing = {
  length: number;
  standingsTitle: string;
  division: string;
  headers: string[]; // dynamic column names
  rows: Array<{
    rank: string;
    team: string;
    logo: string;
    teamUrl: string;
    [key: string]: string; // allows dynamic stats like "W-L", "PTS", etc.
  }>;
};