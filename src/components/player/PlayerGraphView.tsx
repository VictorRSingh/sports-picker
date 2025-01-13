import { Filters } from "@/interfaces/Filters";
import { GameLog } from "@/interfaces/GameLog";
import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

interface PlayerGraphViewProps {
  gameLogs: GameLog;
  filters: Filters;
}

const PlayerGraphView = ({ gameLogs, filters }: PlayerGraphViewProps) => {
  const [selectedStat, setSelectedStat] = useState<number>(2);
  const [overUnder, setOverUnder] = useState<number>(0);
  const [playerAverage, setPlayerAverage] = useState<number>(0);
  const [columnData, setColumnData] = useState<number[]>([]);

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

  const labels = gameLogs.rows.map((row) => row.columns[0].text.split(" ")[0]);

  // Calculate hits and percentage based on filtered columnData
  const hits = columnData.filter((value) => value >= overUnder).length;
  const hitPercentage =
    columnData.length > 0
      ? ((hits / columnData.length) * 100).toFixed(2)
      : "0.00";

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Game Data",
        data: columnData,
        backgroundColor: columnData.map((value) =>
          value >= overUnder
            ? "rgba(75, 192, 192, 0.6)"
            : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: columnData.map((value) =>
          value >= overUnder ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
      {
        type: "line" as const,
        label: "Over/Under Line",
        data: Array(labels.length).fill(overUnder),
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        type: "line" as const,
        label: "Average",
        data: Array(labels.length).fill(playerAverage),
        borderColor: "yellow",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Data for Selected Stat: ${gameLogs.headers.columns[selectedStat].text}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center gap-x-4">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="select">Select Stat to Graph</label>
          <select
            value={selectedStat}
            onChange={(e) => setSelectedStat(Number(e.target.value))}
            className="text-black"
          >
            <option value={"Select a Stat"}>Select a Stat</option>
            {gameLogs.headers.columns.slice(1).map((header, index) => (
              <option key={index} value={header.index}>
                {header.text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>
            Current Line Hits: {hits} {`(${hitPercentage}%)`}
          </p>
          <p>Player Average: {playerAverage.toFixed(2)}</p>
        </div>
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
          <input type="number" value={overUnder} onChange={(e) => setOverUnder(Number(e.target.value))} className="text-black" />
        </div>
      </div>
      {selectedStat && (
        <div className="min-h-[200px]">
          {!Number.isNaN(columnData[0]) ? (
            <Chart type="bar" data={chartData} options={chartOptions} />
          ) : (
            "No Graph Data Available"
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerGraphView;
