import { Stat } from "./Stat";

export type Team = {
    name: string;
    webUrl: string;
    sport: string;
    image: string;
    stats?: Stat[];
}