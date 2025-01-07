import { OverUnderInput } from "@/components/PlayerGameLogs/OverUnderInput";
import PlayerGraphs from "@/components/PlayerGraphs";
import { GameLog } from "@/interfaces/GameLog";

interface NFLProps {
    gamelog: GameLog[];
    position: string;
    overUnder: any;
    setOverUnder: React.Dispatch<React.SetStateAction<any>>;
  }
  
  export const NFLSection: React.FC<NFLProps> = ({ gamelog, position, overUnder, setOverUnder }) => {
    const positionMapping: Record<string, (keyof GameLog)[]> = {
      QUARTERBACK: ["passingYards", "completions", "rushingYards"],
      RUNNING_BACK: ["rushingAttempts", "rushingYards", "rushingYardsPerAttemptAverage"],
      WIDE_RECEIVER: ["receptions", "receivingYards", "receivingTouchdowns"],
      TIGHT_END: ["receptions", "receivingYards"],
    };
  
    const stats = positionMapping[position] || [];
  
    return (
      <>
        {stats.map((stat) => (
          <div className="w-full" key={stat}>
            <OverUnderInput
              label={`Over/Under: ${stat}`}
              value={overUnder[position.toLowerCase()][stat]} // Use proper type or cast
              onChange={(value) =>
                setOverUnder((prev: any) => ({
                  ...prev,
                  nfl: {
                    ...prev.nfl,
                    [position.toLowerCase()]: {
                      ...prev.nfl[position.toLowerCase()],
                      [stat]: value,
                    },
                  },
                }))
              }
            />
            <PlayerGraphs
              gamelog={gamelog}
              statistic={stat}
              overUnder={overUnder[position.toLowerCase()][stat]}
            />
          </div>
        ))}
      </>
    );
  };
  