import { Filters } from "@/interfaces/Filters";
import { GameLog } from "@/interfaces/GameLog";
import React from "react";

interface PlayerGameLogsProps {
  gameLogs: GameLog;
  filters: Filters;
}
const PlayerGameLogs = ({ gameLogs, filters }: PlayerGameLogsProps) => {
  return (
<div className="overflow-x-auto max-w-full h-1/2">
  <div className="w-full">
    {`Showing ${filters.dataSetSize} games for player`}
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
</div>

  );
};

export default PlayerGameLogs;
