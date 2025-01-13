import { GameLog } from "@/interfaces/GameLog";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface GraphFiltersProps {
  columnData: number[];
  playerAverage: number;
  setPlayerAverage: Dispatch<SetStateAction<number>>;
  selectedStat: number;
  setSelectedStat: Dispatch<SetStateAction<number>>;
  gameLogs: GameLog;
  overUnder: number;
  setOverUnder: Dispatch<SetStateAction<number>>;
}

const GraphFilters = ({
  columnData,
  playerAverage,
  setPlayerAverage,
  selectedStat,
  setSelectedStat,
  gameLogs,
  overUnder,
  setOverUnder,
}: GraphFiltersProps) => {
  // Update playerAverage whenever columnData changes
  useEffect(() => {
    if (columnData.length > 0) {
      setPlayerAverage(
        columnData.reduce((total, num) => total + num, 0) / columnData.length
      );
    } else {
      setPlayerAverage(0);
    }
  }, [columnData]);

  return (
    <div className="grid grid-cols-2 mt-5 gap-y-2">
      <div className="col-span-full md:col-span-1">
        <select
          value={selectedStat}
          onChange={(e) => setSelectedStat(Number(e.target.value))}
          className="text-black"
        >
          <option value={"Select a Stat"} disabled>Select a Stat</option>
          {gameLogs.headers.columns.slice(1).map((header, index) => (
            <option key={index} value={header.index}>
              {header.text}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-full md:col-span-1">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="slider">O/U Line {`(${overUnder})`}</label>
          <input
            type="range"
            id="slider"
            min={0}
            max={Math.max(...columnData) + 1}
            value={overUnder}
            onChange={(e) => setOverUnder(Number(e.target.value))}
            step={0.5}
          />
          <input
            type="number"
            value={overUnder}
            onChange={(e) => setOverUnder(Number(e.target.value))}
            className="text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default GraphFilters;
