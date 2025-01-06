import useGameLog from "@/hooks/useGameLog";
import { Player } from "@/interfaces/Player";
import React, { useEffect, useState } from "react";

interface PlayerGameLogsProps {
  playerObject: Player;
}

const PlayerGameLogs: React.FC<PlayerGameLogsProps> = ({ playerObject }) => {
  const { gamelog, setGameLog, fetchGameLog } = useGameLog({
    playerObject: playerObject,
  });

  useEffect(() => {
    fetchGameLog();
  }, [playerObject]);

  useEffect(() => {
    console.log(gamelog);
  }, [gamelog]);

  return (
    <div className="border-2 w-full overflow-x-auto max-w-[90vw]">
      {gamelog && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2 p-2">
              <th className="w-20">GAME</th>
              <th className="w-20">W/L</th>
              {gamelog[0].minutesPlayed ? (
                //NBA
                <>
                  <th className="w-20">MIN</th>
                  <th className="w-20">PTS</th>
                  <th className="w-20">FG</th>
                  <th className="w-20">3FG</th>
                  <th className="w-20">FT</th>
                  <th className="w-20">OFF REB</th>
                  <th className="w-20">DEF REB</th>
                  <th className="w-20">REB</th>
                  <th className="w-20">AST</th>
                  <th className="w-20">STL</th>
                  <th className="w-20">BLK</th>
                  <th className="w-20">PF</th>
                  <th className="w-20">TO</th>
                  <th className="w-20">+/-</th>
                </>
              ) : gamelog[0].completions ? (
                //NFL Quarterback
                <>
                  <th className="w-20">COMP</th>
                  <th className="w-20">PATT</th>
                  <th className="w-20">PCT</th>
                  <th className="w-20">PYDS</th>
                  <th className="w-20">PAVG</th>
                  <th className="w-20">PTD</th>
                  <th className="w-20">INT</th>
                  <th className="w-20">SCK</th>
                  <th className="w-20">SCKYDS</th>
                  <th className="w-20">RATT</th>
                  <th className="w-20">RYDS</th>
                  <th className="w-20">RAVG</th>
                  <th className="w-20">RTD</th>
                  <th className="w-20">FUM</th>
                </>
              ) : gamelog[0].receptions && !gamelog[0].fumbles ? (
                //NFL Wide Receiver
                <>
                  <th className="w-20">TGT</th>
                  <th className="w-20">REC</th>
                  <th className="w-20">RECYDS</th>
                  <th className="w-20">RECTD</th>
                  <th className="w-20">RATT</th>
                  <th className="w-20">RYDS</th>
                  <th className="w-20">RAVG</th>
                  <th className="w-20">RTD</th>
                </>
              ) : (
                gamelog[0].fumbles && (
                  // NFL Running Back
                  <>
                    <th className="w-20">RATT</th>
                    <th className="w-20">RYDS</th>
                    <th className="w-20">RAVG</th>
                    <th className="w-20">RTD</th>
                    <th className="w-20">FUM</th>
                    <th className="w-20">TGT</th>
                    <th className="w-20">REC</th>
                    <th className="w-20">RECTD</th>
                  </>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {gamelog.map((game, index) => (
              <tr
                key={index}
                className="grid grid-cols-[auto,auto,repeat(15,auto)] gap-2 p-2 border-b border-gray-300"
              >
                <td className="w-20 flex justify-end">{game.opposition}</td>
                <td className="w-20 flex justify-end">{game.winLose}</td>
                {game.minutesPlayed ? (
                  //NBA
                  <>
                    <td className="w-20 flex justify-end">
                      {game.minutesPlayed}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.points}
                    </td>
                    <td className="w-20 flex justify-end">
                      <p>{game.fieldGoals?.made}/{game.fieldGoals?.taken}</p>
                    </td>
                    <td className="w-20 flex justify-end">
                      <p>{game.threePointFieldGoals?.made}/{game.threePointFieldGoals?.taken}</p>
                    </td>
                    <td className="w-20 flex justify-end">
                      <p>{game.freeThrows?.made}/{game.freeThrows?.taken}</p>
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.offensiveRebounds}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.defensiveRebounds}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.reboundsTotal}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.assists}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.steals}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.blocks}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.personalFouls}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.turnovers}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.plusMinus}
                    </td>
                  </>
                ) : game.completions ? (
                  //NFL Quarterback
                  <>
                    <td className="w-20 flex justify-end">
                      {game.completions}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.passingAttempts}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.completionPercent}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.passingYards}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.passingYardsPerAttemptAverage}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.passingTouchdowns}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.interceptions}
                    </td>
                    <td className="w-20 flex justify-end">{game.sacks}</td>
                    <td className="w-20 flex justify-end">{game.sackYards}</td>
                    <td className="w-20 flex justify-end">
                      {game.rushingAttempts}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingYards}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingYardsPerAttemptAverage}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingTouchdowns}
                    </td>
                    <td className="w-20 flex justify-end">{game.fumbles}</td>
                  </>
                ) : game.receptions && !game.fumbles ? (
                  //NFL Wide Receiver
                  <>
                    <td className="w-20 flex justify-end">{game.targets}</td>
                    <td className="w-20 flex justify-end">{game.receptions}</td>
                    <td className="w-20 flex justify-end">
                      {game.receivingYards}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.receivingTouchdowns}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingAttempts}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingYards}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingYardsPerAttemptAverage}
                    </td>
                    <td className="w-20 flex justify-end">
                      {game.rushingTouchdowns}
                    </td>
                  </>
                ) : (
                  game.rushingAttempts &&
                  game.fumbles && (
                    //NFL Running
                    <>
                      <td className="w-20 flex justify-end">
                        {game.rushingAttempts}
                      </td>
                      <td className="w-20 flex justify-end">
                        {game.rushingYards}
                      </td>
                      <td className="w-20 flex justify-end">
                        {game.rushingYardsPerAttemptAverage}
                      </td>
                      <td className="w-20 flex justify-end">
                        {game.rushingTouchdowns}
                      </td>
                      <td className="w-20 flex justify-end">{game.fumbles}</td>
                      <td className="w-20 flex justify-end">{game.targets}</td>
                      <td className="w-20 flex justify-end">
                        {game.receptions}
                      </td>
                      <td className="w-20 flex justify-end">
                        {game.receivingTouchdowns}
                      </td>
                    </>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerGameLogs;
