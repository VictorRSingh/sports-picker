"use client";

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import { DEBUG } from '@/config';
const NBA = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(`${DEBUG ? '/NBA/schedule' : '/NBA/schedule'}`)
    }, [])
  return (
    <div>Rerouting</div>
  )
}

export default NBA