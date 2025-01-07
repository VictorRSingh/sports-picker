import useGameLog from "@/hooks/useGameLog";
import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import React, { useEffect, useState } from "react";
import PlayerGraphs from "./PlayerGraphs";
import { getRowData } from "@/utils/getRowData";
import { getHeaders } from "@/utils/getHeaders";
import { NBASection } from "@/utils/NBASection";
import { NFLSection } from "@/utils/NFLSection";

interface PlayerGameLogsProps {
  playerObject: Player;
}

const PlayerGameLogs: React.FC<PlayerGameLogsProps> = ({ playerObject }) => {
  const { gamelog, fetchGameLog } = useGameLog({ playerObject });
  const [overUnder, setOverUnder] = useState({
    nba: {
      points: undefined,
      rebounds: undefined,
      assists: undefined,
    },
    nfl: {
      quarterback: { passingYards: undefined, completions: undefined, rushingYards: undefined },
      runningBack: { rushingAttempts: undefined, rushingYards: undefined, rushingAverage: undefined },
      wideReceiver: { receptions: undefined, receivingYards: undefined, receivingTouchdowns: undefined },
      tightEnd: { receptions: undefined, receivingYards: undefined },
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
      <h1>{gamelog.length} Games found for {playerObject.name}</h1>
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
          <NBASection gamelog={gamelog} overUnder={overUnder.nba} setOverUnder={setOverUnder} />
        ) : playerObject.sport === "nfl" ? (
          <NFLSection
            gamelog={gamelog}
            position={playerObject.position}
            overUnder={overUnder.nfl}
            setOverUnder={setOverUnder}
          />
        ) : (
          <>No Graph Data Available</>
        )}
      </div>
    </>
  );
};

export default PlayerGameLogs;
