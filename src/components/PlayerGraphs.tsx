import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // Needed for X-axis with categories
  LinearScale, // Needed for numeric Y-axis
  PointElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GameLog } from "@/interfaces/GameLog";

// Register required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface PlayerGraphProps {
  gamelog: GameLog[];
  statistic: keyof GameLog;
  overUnder?: number;
}

const PlayerGraph: React.FC<PlayerGraphProps> = ({ gamelog, statistic, overUnder }) => {
  const labels = gamelog.map((game) => game.opposition).slice(0, 10);
  const dataValues = gamelog.map((game) => game[statistic]).slice(0, 10);

  const data = {
    labels,
    datasets: [
      {
        label: `Player ${statistic}`,
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Over/Under Line',
        data: Array(labels.length).fill(overUnder),
        borderColor: "rgba(255, 99, 132, 1)", // Red line
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        borderDash: [10, 5], // Dashed line
        tension: 0, // Straight line
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Correct type
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Opposition", // X-axis title
        },
        ticks: {
            stepSize: 0
        }
      },
      y: {
        title: {
          display: true,
          text: statistic, // Y-axis title
        },
        ticks: {
            stepSize: 1
        }
      },
    },
  };
  
  

  return (
    <div className="w-full max-h-[50vh] overflow-x-auto overflow-y-auto max-w-[90vw]">
      <Line className="" data={data} options={options} />
    </div>
  );
};

export default PlayerGraph;
