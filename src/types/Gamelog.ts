export type Gamelog = {
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
        }>;
      }>;
}