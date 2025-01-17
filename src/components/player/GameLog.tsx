import { useGameLog } from "@/hooks/useGameLog";
import { Filters } from "@/types/Filter";
import { Gamelog } from "@/types/Gamelog";
import { Player } from "@/types/Player";
import React from "react";

interface PlayerGameLogsProps {
  player: Player;
}
const PlayerGameLogs = ({ player }: PlayerGameLogsProps) => {
  const { gameLogs } = useGameLog(player);
  return (
    <div className="overflow-x-auto h-full">
      {gameLogs && (
        <div className="w-full">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                {gameLogs.headers.columns.map((header, index) => (
                  <th key={index} className="border px-2 py-1">
                    {header.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gameLogs.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.columns.map((column, colIndex) => (
                    <td key={colIndex} className="border px-2 py-1">
                      <p className="flex justify-center">{column.text}</p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerGameLogs;
