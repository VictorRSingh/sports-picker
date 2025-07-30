import { Game } from '@/types/Game';
import React from 'react'
import MatchupHeader from '../matchups/MatchupHeader';
import MatchupRow from '../matchups/MatchupRow';

interface GamePreviewProps {
    game: Game;
}

const GamePreview = ({ game }: GamePreviewProps) => {
  return (
    <div className='bg-neutral-800 rounded p-4 mb-4'>
        {/* <MatchupHeader />
        <MatchupRow key={game?.teams?.awayTeam.name} team={game.teams?.awayTeam.name} />
        <MatchupRow key={game?.teams?.homeTeam.name} team={game.teams?.homeTeam.name} /> */}
    </div>
  )
}

export default GamePreview