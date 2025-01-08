import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";
import { getQuarterbackCompletionsAverage, getQuarterbackPassingAverage, getQuarterbackRushingYardsAverage, getRunningBackRushingAttemptsAverage, getRunningBackRushingYardsAttemptAverage, getRunningBackRushingYardsAverage, getTightEndReceivingYardsAverage, getTightEndReceptionsAverage, getWideReceiverReceivingTouchdownsAverage, getWideReceiverReceivingYardsAverage, getWideReceiverReceptionsAverage } from "@/utils/statistics/nfl/getPlayerAverages";
import React from "react";

interface NFLStatisticsProps {
  gameLogs: GameLog[];
  playerObject: Player;
}

const NFLStatistics: React.FC<NFLStatisticsProps> = ({
  gameLogs,
  playerObject,
}) => {
  return (
    <>
        <div>
      {playerObject.position === "QUARTERBACK" ? (
        <>
        <h1>Passing Yards Average: {getQuarterbackPassingAverage(gameLogs).toFixed(1)}</h1>
        <h1>Completions Average: {getQuarterbackCompletionsAverage(gameLogs).toFixed(1)}</h1>
        <h1>Rushing Yards Average: {getQuarterbackRushingYardsAverage(gameLogs).toFixed(1)}</h1>
        </>
      ) : playerObject.position === "RUNNING BACK" ? (
        <>
        <h1>Rushing Attempts Average: {getRunningBackRushingAttemptsAverage(gameLogs).toFixed(1)}</h1>
        <h1>Rushing Yards Average: {getRunningBackRushingYardsAverage(gameLogs).toFixed(1)}</h1>
        <h1>Rushing Yards Per Attempt Average: {getRunningBackRushingYardsAttemptAverage(gameLogs).toFixed(1)}</h1>
        </>
      ) : playerObject.position === "WIDE RECEIVER" ? (
        <>
        <h1>Receptions Average: {getWideReceiverReceptionsAverage(gameLogs).toFixed(1)}</h1>
        <h1>Receiving Yards Average: {getWideReceiverReceivingYardsAverage(gameLogs).toFixed(1)}</h1>
        <h1>Receiving Touchdowns Average: {getWideReceiverReceivingTouchdownsAverage(gameLogs).toFixed(1)}</h1>
        </>
      ) : playerObject.position === "TIGHT END" ? (
        <>
                <h1>Receptions Average: {getTightEndReceptionsAverage(gameLogs).toFixed(1)}</h1>
                <h1>Receiving Yards Average: {getTightEndReceivingYardsAverage(gameLogs).toFixed(1)}</h1>
        </>
      ) : (
        <>No Statistics Available</>
      )}

    </div>
    </>

  );
};

export default NFLStatistics;
