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
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { GameLog } from "@/interfaces/GameLog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarController,
  LineController
);

interface PlayerGraphProps {
  columnData: number[];
  playerAverage: number;
  selectedStat: number;
  gameLogs: GameLog;
  overUnder: number;
}

const PlayerGraph = ({
  columnData,
  gameLogs,
  overUnder,
  playerAverage,
  selectedStat,
}: PlayerGraphProps) => {
  const [maxGraphHeight, setMaxGraphHeight] = useState<number>(300);
  const labels = gameLogs.rows.map((row) => row.columns[0].text.split(" ")[0]);

  useEffect(() => {
    setMaxGraphHeight(Math.max(...columnData) * 20);
  }, [selectedStat])

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
    <div>
      {" "}
      {selectedStat && (
        <div className={`min-h-[${maxGraphHeight}px] h-full`}>
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

export default PlayerGraph;
