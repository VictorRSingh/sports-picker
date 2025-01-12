import { Filters } from '@/interfaces/Filters';
import { GameLog } from '@/interfaces/GameLog'
import React from 'react'

interface PlayerGraphViewProps {
    gameLogs: GameLog;
    filters: Filters;
}

const PlayerGraphView = ({ gameLogs, filters}: PlayerGraphViewProps) => {
  return (
    <div>PlayerGraphView</div>
  )
}

export default PlayerGraphView