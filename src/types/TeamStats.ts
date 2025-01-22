import { Stat } from "./Stat";

export type TeamStats = {
  headers: {
    columns: Array<{
      index: number;
      text: string;
    }>;
  };
  rows: Array<{
    columns: Array<{
        index: number;
        text: string;
    }>
  }>
};
