import { OverUnderInput } from "@/components/PlayerGameLogs/OverUnderInput";
import PlayerGraphs from "@/components/PlayerGraphs";
import { GameLog } from "@/interfaces/GameLog";

interface NBAProps {
  gamelog: GameLog[];
  overUnder: { points?: number; rebounds?: number; assists?: number };
  setOverUnder: React.Dispatch<React.SetStateAction<any>>;
}

export const NBASection: React.FC<NBAProps> = ({ gamelog, overUnder, setOverUnder }) => {
  // Explicitly list the keys
  const stats: (keyof GameLog)[] = ["points", "rebounds", "assists"];

  return (
    <>
      {stats.map((stat) => (
        <div className="w-full" key={stat}>
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
          <PlayerGraphs
            gamelog={gamelog}
            statistic={stat} // Ensure PlayerGraphs accepts `keyof GameLog`
            overUnder={overUnder[stat as keyof typeof overUnder]}
          />
        </div>
      ))}
    </>
  );
};
