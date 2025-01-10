export interface Team {
    logo: string;
    name: string;
    shortName: string;
    webUrl: string;
}

export interface Matchup {
    date: string;
    matchLink: string;
    matchId: string;
    teams: Team[];
}