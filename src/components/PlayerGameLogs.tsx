import useGameLog from "@/hooks/useGameLog";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import React, { useEffect, useState } from "react";

interface PlayerGameLogsProps {
  playerObject: Player;
}

const PlayerGameLogs: React.FC<PlayerGameLogsProps> = ({ playerObject }) => {
  const { gamelog, fetchGameLog } = useGameLog({ playerObject });

  useEffect(() => {
    fetchGameLog();
    console.log(playerObject);
  }, [playerObject]);

  if (!gamelog || gamelog.length === 0) return null;

  const headers = getHeaders(playerObject);

  return (
    <div className="border-2 w-full overflow-x-auto max-w-[90vw]">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2 p-2">
            <th className="w-20">GAME</th>
            <th className="w-20">W/L</th>
            {headers.map((header, index) => (
              <th key={index} className="w-20">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gamelog.map((game, index) => {
            const rowData = getRowData(game, playerObject);
            return (
              <tr
                key={index}
                className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2 p-2 border-b border-gray-300"
              >
                <td className="w-20 flex justify-end">{game.opposition}</td>
                <td className="w-20 flex justify-end">{game.winLose}</td>
                {(rowData!).map((data, idx) => (
                  <td key={idx} className="w-20 flex justify-end">
                    {data}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const getHeaders = (playerObject: Player) => {
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
  } else if (playerObject.position === "RUNNING BACK" && playerObject.sport === "nfl") {
    // NFL Running Back
    return ["RATT", "RYDS", "RAVG", "RTD", "FUM", "TGT", "REC", "RECTD"];
  } else if (playerObject.position === "WIDE RECEIVER" || playerObject.position === "TIGHT END"  && playerObject.sport === "nfl") {
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

const getRowData = (game: GameLog, player: Player) => {
  if (player.position === "QUARTERBACK" && player.sport === "nfl") {
    // NFL Quarterback
    return [
      game.completions || 0,
      game.passingAttempts || 0,
      game.completionPercent || 0,
      game.passingYards || 0,
      game.passingYardsPerAttemptAverage || 0,
      game.passingTouchdowns || 0,
      game.interceptions || 0,
      game.sacks || 0,
      game.sackYards || 0,
      game.rushingAttempts || 0,
      game.rushingYards || 0,
      game.rushingYardsPerAttemptAverage || 0,
      game.rushingTouchdowns || 0,
      game.fumbles || 0,
    ];
  } else if (player.position === "RUNNING BACK" && player.sport === "nfl") {
    // NFL Running Back
    return [
      game.rushingAttempts || 0,
      game.rushingYards || 0,
      game.rushingYardsPerAttemptAverage || 0,
      game.rushingTouchdowns || 0,
      game.fumbles || 0,
      game.targets || 0,
      game.receptions || 0,
      game.receivingTouchdowns || 0,
    ];
  } else if (player.position === "WIDE RECEIVER" || player.position === "TIGHT END" && player.sport === "nfl") {
    // NFL Wide Receiver
    return [
      game.targets || 0,
      game.receptions || 0,
      game.receivingYards || 0,
      game.receivingTouchdowns || 0,
      game.rushingAttempts || 0,
      game.rushingYards || 0,
      game.rushingYardsPerAttemptAverage || 0,
      game.rushingTouchdowns || 0,
    ];
  } else if (player.sport === "nba") {
        // NBA
        return [
          game.minutesPlayed,
          game.points,
          `${game.fieldGoals?.made}/${game.fieldGoals?.taken}`,
          `${game.threePointFieldGoals?.made}/${game.threePointFieldGoals?.taken}`,
          `${game.freeThrows?.made}/${game.freeThrows?.taken}`,
          game.offensiveRebounds || 0,
          game.defensiveRebounds || 0,
          game.reboundsTotal || 0,
          game.assists || 0,
          game.steals || 0,
          game.blocks || 0,
          game.personalFouls || 0,
          game.turnovers || 0,
          game.plusMinus,
        ];
  }
};

export default PlayerGameLogs;
