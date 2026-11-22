"use client";
import { useEffect, useState } from "react";
import type { Game } from "@/types/Game";
export function useGame(sport: string, webUrl: string) {
  const [game, setGame] = useState<Game>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setGame(undefined); setError(null); setLoading(true);
    if (!webUrl) { setLoading(false); return () => controller.abort(); }
    fetch(`/api/foxsports/game?sport=${encodeURIComponent(sport)}&webUrl=${encodeURIComponent(webUrl)}`, {signal:controller.signal})
      .then(async r => {if (!r.ok) throw new Error(`Game data request failed (${r.status})`); return r.json();})
      .then(data => {if (!controller.signal.aborted) setGame(data);})
      .catch(e => {if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Unable to load game details");})
      .finally(() => {if (!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  }, [sport, webUrl]);
  return {game, loading, error};
}
