import { OverUnderInput } from "@/components/player/PlayerGameLogs/OverUnderInput";
import PlayerGraphs from "@/components/player/PlayerGraphs";
import { GameLog } from "@/interfaces/GameLog";
import { useState } from "react";

interface NBAProps {
  gamelog: GameLog[];
  overUnder: { points?: number; rebounds?: number; assists?: number };
  setOverUnder: React.Dispatch<React.SetStateAction<any>>;
  average: { points?: number; rebounds?: number; assists?: number };
  deviation: { points?: number; rebounds?: number; assists?: number };
}

export const NBASection: React.FC<NBAProps> = ({
  gamelog,
  overUnder,
  setOverUnder,
  average,
  deviation,
}) => {
  // Explicitly list the keys
  const stats: (keyof GameLog)[] = ["points", "rebounds", "assists"];
  const [predictedPoints, setPredictedPoints] = useState<number>(0);

  return (
    <>
      {stats.map((stat) => (
        <div className="mt-4 w-full" key={stat}>
          <OverUnderInput
            label={`Over/Under: ${stat}`}
            value={overUnder[stat as keyof typeof overUnder]} // Type assertion for nested keys
            onChange={(value) =>
              setOverUnder((prev: any) => ({
                ...prev,
                nba: {
                  ...prev.nba,
                  [stat]: value,
                },
              }))
            }
          />
          <div className="border-2 border-gray-300 h-full">
            <PlayerGraphs
              gamelog={gamelog}
              statistic={stat} // Ensure PlayerGraphs accepts `keyof GameLog`
              overUnder={overUnder[stat as keyof typeof overUnder]}
              average={average[stat as keyof typeof average]}
              prediction={predictedPoints}
              deviation={deviation[stat as keyof typeof deviation]}
            />
          </div>
        </div>
      ))}
    </>
  );
};
