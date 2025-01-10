"use client";

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import { DEBUG } from '@/config';
const NBA = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(`${DEBUG ? 'http://localhost:3000/sportsPicker/sportsPicker/NBA/schedule' : 'sportsPicker/NBA/schedule'}`)
    }, [])
  return (
    <div>Rerouting</div>
  )
}

export default NBA