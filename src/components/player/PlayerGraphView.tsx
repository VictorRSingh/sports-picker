import { Filters } from "@/interfaces/Filters";
import { GameLog } from "@/interfaces/GameLog";
import React, { useEffect, useState } from "react";
import GraphFilters from "./GraphFilters";
import PlayerGraph from "./PlayerGraph";
import GraphFeedback from "./GraphFeedback";

interface PlayerGraphViewProps {
  gameLogs: GameLog;
  filters: Filters;
}

const PlayerGraphView = ({ gameLogs, filters }: PlayerGraphViewProps) => {
  const [columnData, setColumnData] = useState<number[]>([]);
  const [overUnder, setOverUnder] = useState<number>(0);
  const [playerAverage, setPlayerAverage] = useState<number>(0);
  const [selectedStat, setSelectedStat] = useState<number>(2);

  // Update `columnData` based on the selectedStat
  useEffect(() => {
    setColumnData(
      gameLogs.rows
        .map((row) =>
          row.columns[selectedStat].text !== "-"
            ? Number(row.columns[selectedStat].text)
            : 0
        )
        .flat()
    );
  }, [selectedStat, gameLogs.rows]);

  return (
    <div className="p-4 flex flex-col">
      <GraphFilters
        columnData={columnData}
        gameLogs={gameLogs}
        overUnder={overUnder}
        playerAverage={playerAverage}
        selectedStat={selectedStat}
        setOverUnder={setOverUnder}
        setPlayerAverage={setPlayerAverage}
        setSelectedStat={setSelectedStat}
      />

      <GraphFeedback
        columnData={columnData}
        overUnder={overUnder}
        playerAverage={playerAverage}
      />

      <PlayerGraph
        columnData={columnData}
        gameLogs={gameLogs}
        overUnder={overUnder}
        playerAverage={playerAverage}
        selectedStat={selectedStat}
      />
    </div>
  );
};

export default PlayerGraphView;
