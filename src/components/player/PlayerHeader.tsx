import { Player } from '@/types/Player';
import React from 'react'

interface PlayerHeaderProps {
    player: Player;
}

const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  return (
    <div className=''>
        <div className="flex w-full gap-x-4 items-center border-b pb-2">
            <div className="">
                <img src={player.image} width={50}/>
            </div>
            <div className="flex-grow w-full flex flex-col">
                <h1 className='font-bold'>{player.name} {`#${player.details?.number}`}</h1>
                <p className='text-[10px] text-gray-400 font-semibold'>{` ${player.details?.position?.toUpperCase()} | ${player.details?.team}`}</p>
            </div>
        </div>
    </div>
  )
}

export default PlayerHeader