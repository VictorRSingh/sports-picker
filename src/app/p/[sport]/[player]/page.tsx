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
import { PlayerSubnavLinksEnum } from "@/enums/PlayerSubnavLinksEnum";
import { Player } from "@/types/Player";

const PlayerPage = () => {
  const pathname = usePathname();
  const { player } = usePlayer(pathname.replace("/p", ""));
  const { gameLogs } = useGameLog(player as Player);
  const [selectedStat, setSelectedStat] = useState<string>("");
  const { playerProps } = useProps(player?.webUrl!) 
  const [activeTab, setActiveTab] = useState<PlayerSubnavLinksEnum>(
    PlayerSubnavLinksEnum.Stats
  );

  const renderContent = () => {
    if (player && gameLogs) {
      switch (activeTab) {
        case PlayerSubnavLinksEnum.Stats:
          return <PlayerStats player={player} />;
        case PlayerSubnavLinksEnum.Gamelog:
          return <GameLog player={player} gameLogs={gameLogs} />;
        case PlayerSubnavLinksEnum.Analytics:
          return (
            <PlayerGraph
              gameLogs={gameLogs}
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
            />
          );
        case PlayerSubnavLinksEnum.AI:
          return (
            <AiPrompts
              gameLogs={gameLogs}
              player={player}
              playerProps={playerProps}
            />
          );
        case PlayerSubnavLinksEnum.Props:
          return <PlayerPropsPage playerProps={playerProps} />;
        default:
          return null;
      }
    }
  };

  console.log(player);

  return (
    <>
      {player && (
        <div className="flex flex-col gap-y-4 w-full justify-center">
          <PlayerSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlayerHeader player={player} />
          <div className="overflow-x-auto h-full">{renderContent()}</div>
        </div>
      )}
    </>
  );
};

export default PlayerPage;
