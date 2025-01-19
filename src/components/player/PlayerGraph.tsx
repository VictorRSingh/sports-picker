import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Gamelog } from "@/types/Gamelog";
import { getPlayerAverage } from "@/utils/player/getPlayerAverage";
import { getStandardDeviation } from "@/utils/player/getStandardDeviation";
import { getMode } from "@/utils/player/getMode";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

interface PlayerGraphProps {
  gameLogs: Gamelog;
  selectedStat: string;
  setSelectedStat: Dispatch<SetStateAction<string>>;
}

const PlayerGraph = ({
  gameLogs,
  selectedStat,
  setSelectedStat,
}: PlayerGraphProps) => {
  // Ignore the 0th index of headers (e.g., "GAME") and filter numeric columns
  const numericHeaders = gameLogs.headers.columns
    .slice(1) // Exclude the 0th index
    .filter(
      (header, index) =>
        gameLogs.rows.some(
          (row) => !isNaN(parseFloat(row.columns[index + 1]?.text))
        ) // Adjusted index due to slicing
    );

  const buttonStyle = "px-4 py-1 rounded-full border min-w-fit text-xs";
  const buttonStyleActive = "bg-white text-black font-semibold text-xs";

  // Find the index of the selected stat
  const selectedStatIndex = numericHeaders.find(
    (header) => header.text === selectedStat
  )?.index;

  // Extract labels (game dates) and data (selected stat values)
  const labels = gameLogs.rows
    .slice(0)
    .reverse()
    .map((row) => row.columns[0].text.split(" ")[0]);
  const dataValues =
    selectedStatIndex !== undefined
      ? gameLogs.rows
          .slice(0)
          .reverse()
          .map((row) => parseFloat(row.columns[selectedStatIndex]?.text) || 0)
      : [];

  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: selectedStat,
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line" as const,
        label: "Average",
        data: Array(dataValues.length).fill(
          getPlayerAverage(dataValues).toFixed(2)
        ),
        backgroundColor: "rgba(192, 192, 75, 1)",
        borderColor: "rgba(192, 192, 75, 1)",
        borderWidth: 3,
        pointRadius: 1,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Player Stats: ${selectedStat}`,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-4 max-w-full overflow-hidden overflow-x-auto py-1">
        {numericHeaders.map((header) => (
          <button
            key={`${header.index} + ${header.text}`}
            className={`${buttonStyle} ${
              selectedStat === header.text ? buttonStyleActive : ""
            }`}
            onClick={() => setSelectedStat(header.text)}
          >
            {header.text}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-y-4">
        {selectedStat ? (
          <div className="flex">
            <Chart type="bar" data={data} options={options} />

          </div>
        ) : (
          <div className="flex items-center justify-center mt-10">
            Select a stat to graph
          </div>
        )}
        {!isNaN(dataValues[0]) && (
          <div className="grid grid-cols-2 gap-4">
            <label htmlFor="" className="col-span-full lg:col-span-1 border-b pb-4">
              <h1 className="text-sm font-bold uppercase text-gray-600">
                Average {selectedStat}
              </h1>
              <p className="text-5xl">
                {getPlayerAverage(dataValues).toFixed(1)}
              </p>
            </label>
            <label htmlFor="" className="col-span-full lg:col-span-1 border-b pb-4">
              <h1 className="text-sm font-bold uppercase text-gray-600">
                Standard Deviation
              </h1>
              <p className="text-5xl">
                {getStandardDeviation(dataValues).toFixed(1)}
              </p>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerGraph;
