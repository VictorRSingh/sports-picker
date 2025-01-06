import useGameLog from "@/hooks/useGameLog";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import React, { useEffect, useState } from "react";
import PlayerGraphs from "./PlayerGraphs";

interface PlayerGameLogsProps {
  playerObject: Player;
}

const PlayerGameLogs: React.FC<PlayerGameLogsProps> = ({ playerObject }) => {
  const { gamelog, fetchGameLog } = useGameLog({ playerObject });
  const [overUnder, setOverUnder] = useState({
    nba: {
      points: undefined as number | undefined,
      rebounds: undefined as number | undefined,
      assists: undefined as number | undefined,
    },
    nfl: {
      quarterback: {
        passingYards: undefined as number | undefined,
        completions: undefined as number | undefined,
        rushingYards: undefined as number | undefined,
      },
      runningBack: {
        rushingAttempts: undefined as number | undefined,
        rushingYards: undefined as number | undefined,
        rushingAverage: undefined as number | undefined,
      },
      wideReceiver: {
        receptions: undefined as number | undefined,
        receivingYards: undefined as number | undefined,
        receivingTouchdowns: undefined as number | undefined,
      },
      tightEnd: {
        receptions: undefined as number | undefined,
        receivingYards: undefined as number | undefined,
      },
    },
  });

  useEffect(() => {
    fetchGameLog();
    console.log(playerObject);
  }, [playerObject]);

  if (!gamelog || gamelog.length === 0) return null;

  const headers = getHeaders(playerObject);

  return (
    <>
      <h1>
        {gamelog.length} Games found for {playerObject.name}
      </h1>
      <div className="border-2 w-full max-h-[40vh] overflow-x-auto overflow-y-auto max-w-[90vw]">
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
                  {rowData!.map((data, idx) => (
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
      <div className="flex flex-col h-fit max-w-full overflow-x-auto mt-4">
        {playerObject.sport === "nba" ? (
          <>
            <div className="">
              <label htmlFor="" className="flex gap-x-2 justify-end">
                <h1>Over/Under:</h1>
                <input
                  className="text-black"
                  type="number"
                  step={0.5}
                  value={overUnder.nba.points}
                  onChange={(e) =>
                    setOverUnder((prev) => ({
                      ...prev,
                      nba: {
                        ...prev.nba, // Keep other properties in nba unchanged
                        points: Number(e.target.value), // Update the points property
                      },
                    }))
                  }
                />
              </label>
              <PlayerGraphs
                gamelog={gamelog}
                statistic="points"
                overUnder={overUnder.nba.points}
              />
            </div>
            <div className="">
              <label htmlFor="" className="flex gap-x-2 justify-end">
                <h1>Over/Under:</h1>
                <input
                  className="text-black"
                  type="number"
                  step={0.5}
                  value={overUnder.nba.rebounds}
                  onChange={(e) =>
                    setOverUnder((prev) => ({
                      ...prev,
                      nba: {
                        ...prev.nba, // Keep other properties in nba unchanged
                        rebounds: Number(e.target.value), // Update the points property
                      },
                    }))
                  }
                />
              </label>
              <PlayerGraphs
                gamelog={gamelog}
                statistic="rebounds"
                overUnder={overUnder.nba.rebounds}
              />
            </div>
            <div className="">
              <label htmlFor="" className="flex gap-x-2 justify-end">
                <h1>Over/Under:</h1>
                <input
                  className="text-black"
                  type="number"
                  step={0.5}
                  value={overUnder.nba.assists}
                  onChange={(e) =>
                    setOverUnder((prev) => ({
                      ...prev,
                      nba: {
                        ...prev.nba, // Keep other properties in nba unchanged
                        assists: Number(e.target.value), // Update the points property
                      },
                    }))
                  }
                />
              </label>
              <PlayerGraphs
                gamelog={gamelog}
                statistic="assists"
                overUnder={overUnder.nba.assists}
              />
            </div>
          </>
        ) : playerObject.sport === "nfl" ? (
          <>
            {playerObject.position === "QUARTERBACK" ? (
              <>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.quarterback.passingYards}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            quarterback: {
                              ...prev.nfl.quarterback,
                              passingYards: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="passingYards"
                    overUnder={overUnder.nfl.quarterback.passingYards}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.quarterback.completions}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            quarterback: {
                              ...prev.nfl.quarterback,
                              completions: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="completions"
                    overUnder={overUnder.nfl.quarterback.completions}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.quarterback.rushingYards}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            quarterback: {
                              ...prev.nfl.quarterback,
                              rushingYards: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="rushingYards"
                    overUnder={overUnder.nfl.quarterback.rushingYards}
                  />
                </div>
              </>
            ) : playerObject.position === "RUNNING BACK" ? (
              <>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.runningBack.rushingAttempts}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            runningBack: {
                              ...prev.nfl.runningBack,
                              rushingAttempts: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="rushingAttempts"
                    overUnder={overUnder.nfl.runningBack.rushingAttempts}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.runningBack.rushingYards}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            runningBack: {
                              ...prev.nfl.runningBack,
                              rushingYards: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="rushingYards"
                    overUnder={overUnder.nfl.runningBack.rushingYards}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.runningBack.rushingAverage}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            runningBack: {
                              ...prev.nfl.runningBack,
                              rushingAverage: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="rushingYardsPerAttemptAverage"
                    overUnder={overUnder.nfl.runningBack.rushingAverage}
                  />
                </div>
              </>
            ) : playerObject.position === "WIDE RECEIVER" ? (
              <>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.wideReceiver.receptions}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            wideReceiver: {
                              ...prev.nfl.wideReceiver,
                              receptions: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="receptions"
                    overUnder={overUnder.nfl.wideReceiver.receptions}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.wideReceiver.receivingYards}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            wideReceiver: {
                              ...prev.nfl.wideReceiver,
                              receivingYards: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="receivingYards"
                    overUnder={overUnder.nfl.wideReceiver.receivingYards}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.wideReceiver.receivingTouchdowns}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            wideReceiver: {
                              ...prev.nfl.wideReceiver,
                              receivingTouchdowns: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="receivingTouchdowns"
                    overUnder={overUnder.nfl.wideReceiver.receivingTouchdowns}
                  />
                </div>
              </>
            ) : playerObject.position === "TIGHT END" ? (
              <>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.tightEnd.receptions}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            tightEnd: {
                              ...prev.nfl.tightEnd,
                              receptions: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="receptions"
                    overUnder={overUnder.nfl.tightEnd.receptions}
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="flex gap-x-2 justify-end">
                    <h1>Over/Under:</h1>
                    <input
                      className="text-black"
                      type="number"
                      step={0.5}
                      value={overUnder.nfl.tightEnd.receivingYards}
                      onChange={(e) =>
                        setOverUnder((prev) => ({
                          ...prev,
                          nfl: {
                            ...prev.nfl,
                            tightEnd: {
                              ...prev.nfl.tightEnd,
                              receivingYards: Number(e.target.value)
                            }
                          },
                        }))
                      }
                    />
                  </label>
                  <PlayerGraphs
                    gamelog={gamelog}
                    statistic="receivingYards"
                    overUnder={overUnder.nfl.tightEnd.receivingYards}
                  />
                </div>
              </>
            ) : (
              <>No Graph Data Available</>
            )}
          </>
        ) : (
          <>No Graph Data Available</>
        )}
      </div>
    </>
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
  } else if (
    player.position === "WIDE RECEIVER" ||
    (player.position === "TIGHT END" && player.sport === "nfl")
  ) {
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
      game.rebounds || 0,
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
