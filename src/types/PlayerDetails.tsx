import { PlayerPositionEnum } from "@/enums/PlayerPositionEnum";

export type PlayerDetails = {
    number?: number;
    position?: PlayerPositionEnum;
    team?: string;
}