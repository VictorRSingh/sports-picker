import useGameLog from "@/hooks/useGameLog";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PlayerGraphs from "./PlayerGraphs";
import { getRowData } from "@/utils/getRowData";
import { getHeaders } from "@/utils/getHeaders";
import { NBASection } from "@/utils/NBASection";
import { NFLSection } from "@/utils/NFLSection";
import {
  getPlayerAssistsAverage,
  getPlayerPointAverage,
  getPlayerReboundAverage,
} from "@/utils/statistics/nba/getPlayerAverages";
import {
  getQuarterbackCompletionsAverage,
  getQuarterbackPassingAverage,
  getQuarterbackRushingYardsAverage,
  getRunningBackRushingAttemptsAverage,
  getRunningBackRushingYardsAttemptAverage,
  getRunningBackRushingYardsAverage,
  getTightEndReceivingYardsAverage,
  getTightEndReceptionsAverage,
  getWideReceiverReceivingTouchdownsAverage,
  getWideReceiverReceivingYardsAverage,
  getWideReceiverReceptionsAverage,
} from "@/utils/statistics/nfl/getPlayerAverages";

interface PlayerGameLogsProps {
  playerObject: Player;
  setGameLog: Dispatch<SetStateAction<GameLog[]>>;
}

const PlayerGameLogs: React.FC<PlayerGameLogsProps> = ({
  playerObject,
  setGameLog,
}) => {
  const { gamelog, fetchGameLog } = useGameLog({ playerObject });
  const [overUnder, setOverUnder] = useState({
    nba: {
      points: undefined,
      rebounds: undefined,
      assists: undefined,
    },
    nfl: {
      quarterback: {
        passingYards: undefined,
        completions: undefined,
        rushingYards: undefined,
      },
      runningBack: {
        rushingAttempts: undefined,
        rushingYards: undefined,
        rushingAverage: undefined,
      },
      wideReceiver: {
        receptions: undefined,
        receivingYards: undefined,
        receivingTouchdowns: undefined,
      },
      tightEnd: { receptions: undefined, receivingYards: undefined },
    },
  });

  useEffect(() => {
    fetchGameLog();
  }, [playerObject]);

  useEffect(() => {
    if (gamelog && gamelog.length > 0) {
      setGameLog(gamelog);
    }
  }, [gamelog]);

  if (!gamelog || gamelog.length === 0) return null;

  const headers = getHeaders(playerObject);

  return (
    <div className="p-4 flex flex-col">
      {gamelog.length} Games found for {playerObject.name}
      <div className="overflow-x-auto max-w-full">
        <h1 className="mb-4"></h1>
        <div className="max-h-40">
          <table className="w-full border-collapse border ">
            <thead>
              <tr className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2">
                <th className="w-16">GAME</th>
                <th className="w-16">W/L</th>
                {headers.map((header, index) => (
                  <th key={index} className="w-16">
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
                    className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2 border-t"
                  >
                    <td className="w-16 flex justify-center">
                      {game.opposition}
                    </td>
                    <td className="w-16 flex justify-center">{game.winLose}</td>
                    {rowData!.map((data, idx) => (
                      <td key={idx} className="w-16 flex justify-center">
                        {data}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="">
        {playerObject.sport === "nba" ? (
          <NBASection
            gamelog={gamelog}
            overUnder={overUnder.nba}
            setOverUnder={setOverUnder}
            average={{
              points: getPlayerPointAverage(gamelog),
              rebounds: getPlayerReboundAverage(gamelog),
              assists: getPlayerAssistsAverage(gamelog),
            }}
          />
        ) : playerObject.sport === "nfl" ? (
          <NFLSection
            gamelog={gamelog}
            position={playerObject.position}
            overUnder={overUnder.nfl}
            setOverUnder={setOverUnder}
            average={{
              quarterback: {
                passingYards: getQuarterbackPassingAverage(gamelog),
                completions: getQuarterbackCompletionsAverage(gamelog),
                rushingYards: getQuarterbackRushingYardsAverage(gamelog),
              },
              running_back: {
                rushingAttempts: getRunningBackRushingAttemptsAverage(gamelog),
                rushingYards: getRunningBackRushingYardsAverage(gamelog),
                rushingYardsPerAttemptAverage: getRunningBackRushingYardsAttemptAverage(gamelog)
              },
              wide_receiver: {
                receptions: getWideReceiverReceptionsAverage(gamelog),
                receivingYards: getWideReceiverReceivingYardsAverage(gamelog),
                receivingTouchdowns: getWideReceiverReceivingTouchdownsAverage(gamelog)
              },
              tight_end: {
                receptions: getTightEndReceptionsAverage(gamelog),
                receivingYards: getTightEndReceivingYardsAverage(gamelog)
              }
            }}
          />
        ) : (
          <>No Graph Data Available</>
        )}
      </div>
    </div>
  );
};

export default PlayerGameLogs;
