import { Matchup } from "./Matchup";

export interface Schedule {
    date: string;
    matchups: Matchup[];
}