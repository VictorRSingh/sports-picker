"use client";

import { useTeam } from '@/hooks/useTeams';
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';

const PlayerPageLayout = ({children}: {children: React.ReactNode}) => {
    const [sport, setSport] = useState<string>("");
    const pathname = usePathname();
    console.log(pathname)
    const { teams, fetchTeams } = useTeam(sport);

    useEffect(() => {
        if(pathname) {
            setSport(pathname.split("/")[1]);
        }
    }, [pathname])

    useEffect(() => {
        if(sport) {
            fetchTeams();
        }
    }, [sport])

    useEffect(() => {
        if(teams) {
            console.log(teams)
        }
    }, [teams])

  return (
    <div className='w-full'>{children}</div>
  )
}

export default PlayerPageLayout