import { Player } from "./Player";
import { Team } from "./Team";

export type Game = {
  featuredPairing?: {
    title: string;
    awayPlayer?: any,
    homePlayer?: any,
  };
  teamStatsComparison?: {
    title: string;
    awayTeam?: Team,
    homeTeam?: Team
  };
  teamLeadersComparison?: {
    title: string;
    awayTeam?: Team,
    homeTeam?: Team
  };
  [key: string]: any; // Catch-all for other sport-specific or future components
};
