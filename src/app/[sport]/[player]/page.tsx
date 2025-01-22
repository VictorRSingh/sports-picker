"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerStats from "@/components/player/PlayerStats";
import GameLog from "@/components/player/GameLog";
import PlayerSubNav from "@/components/player/PlayerSubNav";
import PlayerHeader from "@/components/player/PlayerHeader";
import { useGameLog } from "@/hooks/useGameLog";
import PlayerGraph from "@/components/player/PlayerGraph";
import AiPrompts from "@/components/player/AiPrompts";
import { useTeam } from "@/hooks/useTeams";

type Tab = "stats" | "gamelog" | "analytics" | "ai"; // Matches PlayerSubNavProps

const PlayerPage = () => {
  const pathname = usePathname();
  const { player } = usePlayer(pathname);
  const { gameLogs } = useGameLog(player!);
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
          return <AiPrompts gameLogs={gameLogs} player={player} />
        default:
          return null;
      }
    }
  };

  return (
    <>
      {player && gameLogs ? (
        <div className="flex flex-col gap-y-4 w-full justify-center lg:px-40">
          <PlayerSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlayerHeader player={player} />
          <div className="overflow-x-auto h-full">{renderContent()}</div>
        </div>
      ) : <div>Loading Data..</div>}
    </>
  );
};

export default PlayerPage;
