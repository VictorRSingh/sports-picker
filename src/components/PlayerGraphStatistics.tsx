import { GameLog } from '@/interfaces/GameLog'
import { Player } from '@/interfaces/Player';
import React from 'react'
import NBAStatistics from './PlayerGraphStatistics/NBAStatistics';
import NFLStatistics from './PlayerGraphStatistics/NFLStatistics';

interface PlayerGraphStatisticsProps {
    playerObject: Player;
    gameLogs: GameLog[];
}

const PlayerGraphStatistics: React.FC<PlayerGraphStatisticsProps> = ({playerObject, gameLogs}) => {
  return (
    <>
    {gameLogs.length > 0 ? 
    <>
        Game Play This Season: {gameLogs.length}

        {playerObject.sport === "nba" 
        ? <>
            <NBAStatistics gameLogs={gameLogs}/>
        </> 
        : <><NFLStatistics playerObject={playerObject} gameLogs={gameLogs}/></>}
    </> : 
    <>No Game Data Available</>}
    </>
  )
}

export default PlayerGraphStatistics