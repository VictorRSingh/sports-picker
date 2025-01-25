import { Sportsbook } from "./Sportsbook";

export type Prop = {
  sportsbook: Sportsbook;
  over: {
    line: string;
    odd: string;
  };
  under: {
    line: string;
    odd: string;
  };
};
