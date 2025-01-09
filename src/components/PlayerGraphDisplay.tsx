import React, { useState } from "react";
import { NBASection } from "@/utils/NBASection";
import { NFLSection } from "@/utils/NFLSection";
import {
  getPlayerAssistsAverage,
  getPlayerPointAverage,
  getPlayerReboundAverage,
} from "@/utils/statistics/nba/getPlayerAverages";
import {
  getQuarterbackCompletionsAverage,
  getQuarterbackPassingAverage,
  getQuarterbackRushingYardsAverage,
  getRunningBackRushingAttemptsAverage,
  getRunningBackRushingYardsAttemptAverage,
  getRunningBackRushingYardsAverage,
  getTightEndReceivingYardsAverage,
  getTightEndReceptionsAverage,
  getWideReceiverReceivingTouchdownsAverage,
  getWideReceiverReceivingYardsAverage,
  getWideReceiverReceptionsAverage,
} from "@/utils/statistics/nfl/getPlayerAverages";
import { Player } from "@/interfaces/Player";
import { GameLog } from "@/interfaces/GameLog";

interface PlayerGraphDisplayProps {
    player: Player | null;
    gameLogs: GameLog[];
}
const PlayerGraphDisplay = ({ player, gameLogs}: PlayerGraphDisplayProps) => {
    const [overUnder, setOverUnder] = useState({
        nba: {
          points: undefined,
          rebounds: undefined,
          assists: undefined,
        },
        nfl: {
          quarterback: {
            passingYards: undefined,
            completions: undefined,
            rushingYards: undefined,
          },
          runningBack: {
            rushingAttempts: undefined,
            rushingYards: undefined,
            rushingAverage: undefined,
          },
          wideReceiver: {
            receptions: undefined,
            receivingYards: undefined,
            receivingTouchdowns: undefined,
          },
          tightEnd: { receptions: undefined, receivingYards: undefined },
        },
      });
  return (
    <div>
      {player && player.sport === "nba" ? (
        <>
          <NBASection
            gamelog={gameLogs}
            overUnder={overUnder.nba}
            setOverUnder={setOverUnder}
            average={{
              points: getPlayerPointAverage(gameLogs),
              rebounds: getPlayerReboundAverage(gameLogs),
              assists: getPlayerAssistsAverage(gameLogs),
            }}
          />
        </>
      ) : player && player.sport === "nfl" ? (
        <NFLSection
          gamelog={gameLogs}
          position={player.position}
          overUnder={overUnder.nfl}
          setOverUnder={setOverUnder}
          average={{
            quarterback: {
              passingYards: getQuarterbackPassingAverage(gameLogs),
              completions: getQuarterbackCompletionsAverage(gameLogs),
              rushingYards: getQuarterbackRushingYardsAverage(gameLogs),
            },
            running_back: {
              rushingAttempts: getRunningBackRushingAttemptsAverage(gameLogs),
              rushingYards: getRunningBackRushingYardsAverage(gameLogs),
              rushingYardsPerAttemptAverage:
                getRunningBackRushingYardsAttemptAverage(gameLogs),
            },
            wide_receiver: {
              receptions: getWideReceiverReceptionsAverage(gameLogs),
              receivingYards: getWideReceiverReceivingYardsAverage(gameLogs),
              receivingTouchdowns:
                getWideReceiverReceivingTouchdownsAverage(gameLogs),
            },
            tight_end: {
              receptions: getTightEndReceptionsAverage(gameLogs),
              receivingYards: getTightEndReceivingYardsAverage(gameLogs),
            },
          }}
        />
      ) : (
        <>No Graph Data Available</>
      )}
    </div>
  );
};

export default PlayerGraphDisplay;
