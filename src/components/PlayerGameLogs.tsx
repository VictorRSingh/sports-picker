import { GameLog } from '@/interfaces/GameLog';
import { Player } from '@/interfaces/Player';
import { getHeaders } from '@/utils/getHeaders';
import { getRowData } from '@/utils/getRowData';
import React from 'react'

interface PlayerGameLogsProps {
    player: Player | null;
    gameLogs: GameLog[];
}
const PlayerGameLogs = ({ player, gameLogs}: PlayerGameLogsProps) => {
    
  const headers = getHeaders(player);
  return (
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
          {gameLogs.map((game, index) => {
            const rowData = getRowData(game, player);
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
  )
}

export default PlayerGameLogs