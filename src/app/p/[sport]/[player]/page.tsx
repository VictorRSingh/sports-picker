"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerStats from "@/components/player/PlayerStats";
import GameLog from "@/components/player/GameLog";
import PlayerSubNav from "@/components/player/PlayerSubNav";
import PlayerHeader from "@/components/player/PlayerHeader";
import { useGameLog } from "@/hooks/useGameLog";
import PlayerGraph from "@/components/player/PlayerGraph";
import AiPrompts from "@/components/player/AiPrompts";
import PlayerPropsPage from "@/components/player/PlayerProps";
import { useProps } from "@/hooks/useProps";

type Tab = "stats" | "gamelog" | "analytics" | "ai" | "props"; // Matches PlayerSubNavProps

const PlayerPage = () => {
  const pathname = usePathname();
  const { player } = usePlayer(pathname.replace("/p", ""));
  const { gameLogs } = useGameLog(player!);
  const { playerProps, fetchPlayerProps } = useProps(player?.webUrl.replace("-player", "").replace("-", "+")!);
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  // Default to the first numeric stat
  const [selectedStat, setSelectedStat] = useState<string>("");
  
  const renderContent = () => {
    if (player && gameLogs) {
      switch (activeTab) {
        case "stats":
          return <PlayerStats player={player} />;
        case "gamelog":
          return <GameLog player={player} gameLogs={gameLogs} />;
        case "analytics":
          return <PlayerGraph gameLogs={gameLogs} selectedStat={selectedStat} setSelectedStat={setSelectedStat}/>;
        case "ai":
          return <AiPrompts gameLogs={gameLogs} player={player} playerProps={playerProps} />
        case "props": 
          return <PlayerPropsPage playerProps={playerProps} />
        default:
          return null;
      }
    }
  };


  return (
    <>
      {player && gameLogs ? (
        <div className="flex flex-col gap-y-4 w-full justify-center">
          <PlayerSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlayerHeader player={player} />
          <div className="overflow-x-auto h-full">{renderContent()}</div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <span>Loading player data...</span>
              {player && <span className="text-green-500">✓</span>}
            </div>
            <div className="flex items-center gap-x-2">
              <span>Loading game logs...</span>
              {gameLogs && <span className="text-green-500">✓</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerPage;
