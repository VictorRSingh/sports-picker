import React from 'react'

interface PlayerCardProps {
    name: string;
    image: string;
}

const PlayerCard = ({ name, image }: PlayerCardProps) => {
  return (
    <div className='flex flex-col items-center gap-y-4'>
        <h1 className='text-2xl'>{name}</h1>
        <img className='rounded-full border-2' src={image} /> 
    </div>
  )
}

export default PlayerCard