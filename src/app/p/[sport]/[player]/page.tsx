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
import BettingResearch, { type SelectedCoverQuote } from "@/components/betting/BettingResearch";
import type { Market } from "@/lib/betting";

const PlayerPage = () => {
  const pathname = usePathname();
  const { player } = usePlayer(pathname.replace("/p", ""));
  const [season, setSeason] = useState(new Date().getFullYear());
  const { gameLogs, loading: gameLogsLoading, error: gameLogsError } = useGameLog(player as Player, season);
  const [selectedStat, setSelectedStat] = useState<string>("");
  const { playerProps, loading: propsLoading, error: propsError, sourceUrl: propsSourceUrl } = useProps(player?.webUrl || "", player?.name || "", player?.details?.team || "") 
  const [activeTab, setActiveTab] = useState<PlayerSubnavLinksEnum>(
    PlayerSubnavLinksEnum.Stats
  );

  const [selectedQuote, setSelectedQuote] = useState<SelectedCoverQuote | null>(null);
  const handleCoverSelect = (marketName: string, line: string, odds: string, side: "over" | "under", sportsbook: string) => {
    const normalized = marketName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const mapping: Record<string, Market> = {
      "points": "points", "player points": "points", "points odds": "points", "player points odds": "points", "points scored odds": "points",
      "rebounds": "rebounds", "player rebounds": "rebounds", "rebounds odds": "rebounds", "player rebounds odds": "rebounds", "total rebounds odds": "rebounds",
      "assists": "assists", "player assists": "assists", "assists odds": "assists", "player assists odds": "assists", "total assists odds": "assists",
      "points rebounds assists": "pra", "points rebounds assists odds": "pra", "pts reb ast": "pra", "pra": "pra", "pra odds": "pra", "points rebounds and assists": "pra", "points rebounds and assists odds": "pra",
      "passing yards": "passing_yards", "passing yards odds": "passing_yards", "total passing yards odds": "passing_yards",
      "rushing yards": "rushing_yards", "rushing yards odds": "rushing_yards", "total rushing yards odds": "rushing_yards",
      "receiving yards": "receiving_yards", "receiving yards odds": "receiving_yards", "total receiving yards odds": "receiving_yards",
      "receptions": "receptions", "receptions odds": "receptions", "total receptions odds": "receptions", "total receptions": "receptions",
      "shots": "shots", "shots on goal": "shots", "shots on goal odds": "shots", "total shots on goal odds": "shots",
      "saves": "saves", "saves odds": "saves", "total saves odds": "saves", "goalie saves odds": "saves",
    };
    const matched = mapping[normalized];
    const parsedLine = Number(line);
    const parsedOdds = Number(odds.replace(/[^+\-\d]/g, ""));
    if (!matched || !Number.isFinite(parsedLine) || parsedLine < 0 || !Number.isInteger(parsedOdds) || Math.abs(parsedOdds) < 100) {
      window.alert("This Covers market or its odds cannot be used in Betting Research yet. Choose a supported NBA, NFL or NHL market with a valid nonnegative line and American odds.");
      return;
    }
    setSelectedQuote({market:matched, line:String(parsedLine), odds:String(parsedOdds), side, sportsbook, selectionId:Date.now()});
    document.getElementById("player-betting-research")?.scrollIntoView({behavior:"smooth",block:"start"});
  };

  const renderContent = () => {
    if (gameLogsLoading) return <p className="text-sm theme-muted">Loading {season} game logs…</p>;
    if (gameLogsError) return <p role="alert" className="text-sm theme-danger">{gameLogsError}</p>;
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
          return <div className="space-y-4"><div id="player-betting-research"><BettingResearch key={`${player.webUrl}-${season}`} sport={pathname.split("/")[2]} defaultPlayer={player.name} gameLogs={gameLogs} season={season} selectedQuote={selectedQuote} /></div><PlayerPropsPage playerProps={playerProps} loading={propsLoading} error={propsError} sourceUrl={propsSourceUrl} onSelect={handleCoverSelect} /></div>;
        default:
          return null;
      }
    }
  };

  return (
    <>
      {player && (
        <div className="flex flex-col gap-y-4 w-full justify-center">
          <PlayerSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlayerHeader player={player} />
          <div className="flex flex-wrap items-center gap-3 rounded-lg border theme-border theme-surface px-3 py-2">
            <label htmlFor="player-log-season" className="text-xs font-semibold theme-muted">Game-log season</label>
            <select id="player-log-season" className="rounded-md border theme-border theme-surface-raised px-3 py-1.5 text-sm" value={season} onChange={e => setSeason(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year} {year === new Date().getFullYear() ? "(current)" : ""}</option>)}
            </select>
            <span className="text-xs theme-muted">FOX Sports regular-season logs · season availability varies by player</span>
          </div>
          <div className="overflow-x-auto h-full">{renderContent()}</div>
        </div>
      )}
    </>
  );
};

export default PlayerPage;
