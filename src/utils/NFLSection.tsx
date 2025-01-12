import { OverUnderInput } from "@/components/player/PlayerGameLogs/OverUnderInput";
import PlayerGraphs from "@/components/player/PlayerGraphs";
import { GameLog } from "@/interfaces/GameLog";

interface NFLProps {
  gamelog: GameLog[];
  position: string;
  overUnder: any;
  setOverUnder: React.Dispatch<React.SetStateAction<any>>;
  average: Record<string, Record<string, number | undefined>>;
}

// Utility function to normalize position keys
const normalizeKey = (key: string) => key.replace(" ", "_").toLowerCase();

export const NFLSection: React.FC<NFLProps> = ({
  gamelog,
  position,
  overUnder,
  setOverUnder,
  average,
}) => {
  const positionMapping: Record<string, (keyof GameLog)[]> = {
    QUARTERBACK: ["passingYards", "completions", "rushingYards"],
    RUNNING_BACK: [
      "rushingAttempts",
      "rushingYards",
      "rushingYardsPerAttemptAverage",
    ],
    WIDE_RECEIVER: ["receptions", "receivingYards", "receivingTouchdowns"],
    TIGHT_END: ["receptions", "receivingYards"],
  };

  // Normalize position key
  const normalizedPosition = normalizeKey(position);
  const stats = positionMapping[position.replace(" ", "_")] || [];

  console.log(normalizedPosition)
  return (
    <>
      {stats.map((stat) => (
        <div className="mt-4 w-full" key={stat}>
          {/* OverUnderInput */}
          <OverUnderInput
            label={`Over/Under: ${stat}`}
            value={overUnder[normalizedPosition]?.[stat] || 0} // Fallback for undefined
            onChange={(value) =>
              setOverUnder((prev: any) => ({
                ...prev,
                nfl: {
                  ...prev.nfl,
                  [normalizedPosition]: {
                    ...prev.nfl[normalizedPosition],
                    [stat]: value,
                  },
                },
              }))
            }
          />

          {/* PlayerGraphs */}
          <div className="border-2 border-gray-300 h-full">
            <PlayerGraphs
              gamelog={gamelog}
              statistic={stat}
              overUnder={overUnder[normalizedPosition]?.[stat] || 0}
              average={average[normalizedPosition]?.[stat]} // Dynamically access average
            />
          </div>
        </div>
      ))}
    </>
  );
};
