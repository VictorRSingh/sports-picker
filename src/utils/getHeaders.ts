import { Player } from "@/interfaces/Player";

export const getHeaders = (player: Player | null) => {
    if(player) {
      if (player.position === "QUARTERBACK" && player.sport === "nfl") {
        // NFL Quarterback
        return [
          "COMP",
          "PATT",
          "PCT",
          "PYDS",
          "PAVG",
          "PTD",
          "INT",
          "SCK",
          "SCKYDS",
          "RATT",
          "RYDS",
          "RAVG",
          "RTD",
          "FUM",
        ];
      } else if (
        player.position === "RUNNING BACK" &&
        player.sport === "nfl"
      ) {
        // NFL Running Back
        return ["RATT", "RYDS", "RAVG", "RTD", "FUM", "TGT", "REC", "RECTD"];
      } else if (
        player.position === "WIDE RECEIVER" ||
        (player.position === "TIGHT END" && player.sport === "nfl")
      ) {
        // NFL Wide Receiver
        return ["TGT", "REC", "RECYDS", "RECTD", "RATT", "RYDS", "RAVG", "RTD"];
      } else if (player.sport === "nba") {
        // NBA
        return [
          "MIN",
          "PTS",
          "FG",
          "3FG",
          "FT",
          "OFF REB",
          "DEF REB",
          "REB",
          "AST",
          "STL",
          "BLK",
          "PF",
          "TO",
          "+/-",
        ];
      }
    }
    return [];
  };
  