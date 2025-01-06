import { Player } from "@/interfaces/Player";

export const getHeaders = (playerObject: Player) => {
    if (playerObject.position === "QUARTERBACK" && playerObject.sport === "nfl") {
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
      playerObject.position === "RUNNING BACK" &&
      playerObject.sport === "nfl"
    ) {
      // NFL Running Back
      return ["RATT", "RYDS", "RAVG", "RTD", "FUM", "TGT", "REC", "RECTD"];
    } else if (
      playerObject.position === "WIDE RECEIVER" ||
      (playerObject.position === "TIGHT END" && playerObject.sport === "nfl")
    ) {
      // NFL Wide Receiver
      return ["TGT", "REC", "RECYDS", "RECTD", "RATT", "RYDS", "RAVG", "RTD"];
    } else if (playerObject.sport === "nba") {
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
    return [];
  };
  