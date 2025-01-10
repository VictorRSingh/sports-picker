import { GameLog } from '@/interfaces/GameLog'
import { Player } from '@/interfaces/Player';
import React from 'react'
import NBAStatistics from './PlayerGraphStatistics/NBAStatistics';
import NFLStatistics from './PlayerGraphStatistics/NFLStatistics';

interface PlayerGraphStatisticsProps {
    player: Player;
    gameLogs: GameLog[];
}

const PlayerGraphStatistics: React.FC<PlayerGraphStatisticsProps> = ({player, gameLogs}) => {
  return (
    <>
    {gameLogs.length > 0 ? 
    <>
        Game Play This Season: {gameLogs.length}

        {player.sport === "nba" 
        ? <>
            <NBAStatistics gameLogs={gameLogs}/>
        </> 
        : <><NFLStatistics player={player} gameLogs={gameLogs}/></>}
    </> : 
    <>No Game Data Available</>}
    </>
  )
}

export default PlayerGraphStatistics