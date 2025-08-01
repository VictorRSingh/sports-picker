export type TeamStats = {
  category: string;
  sport: string;
  team: string;
  standings: string;
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
