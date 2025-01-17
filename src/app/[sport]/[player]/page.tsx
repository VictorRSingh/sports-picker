"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import PlayerStats from "@/components/player/PlayerStats";
import GameLog from "@/components/player/GameLog";
import PlayerSubNav from "@/components/player/PlayerSubNav";
import PlayerHeader from "@/components/player/PlayerHeader";

type Tab = "stats" | "gamelog"; // Matches PlayerSubNavProps

const PlayerPage = () => {
  const pathname = usePathname();
  const { player } = usePlayer(pathname);
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  const renderContent = () => {
    if (player) {
      switch (activeTab) {
        case "stats":
          return <PlayerStats player={player} />;
        case "gamelog":
          return <GameLog player={player} />;
        default:
          return null;
      }
    }
  };

  return (
    <>
      {player && (
        <div className="flex flex-col gap-y-4 w-full lg:mx-40">
          <PlayerSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlayerHeader player={player} />
          {renderContent()}
        </div>
      )}
    </>
  );
};

export default PlayerPage;
