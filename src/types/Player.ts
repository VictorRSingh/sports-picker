import { Stat } from "./Stat";
import { PlayerDetails } from "./PlayerDetails";

export type Player = {
    name: string;
    image: string;
    webUrl: string;
    stats?: Stat[];
    details?: PlayerDetails;
}