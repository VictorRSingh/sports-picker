"use client";

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation' 
const NBA = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/NBA/schedule')
    }, [])
  return (
    <div>Rerouting</div>
  )
}

export default NBA