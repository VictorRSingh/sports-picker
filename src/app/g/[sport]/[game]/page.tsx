"use client";

import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const params = useParams();
  const game = params.game;

  console.log(game)
  return (
    <div>page</div>
  )
}

export default page