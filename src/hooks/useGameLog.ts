import type { Gamelog } from "@/types/Gamelog";
import type { Player } from "@/types/Player";
import { useEffect, useState } from "react";

export function useGameLog(player: Player | undefined, season: number = new Date().getFullYear()) {
  const [gameLogs, setGameLog] = useState<Gamelog>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!player?.webUrl) { setGameLog(undefined); return; }
    const controller = new AbortController();
    setGameLog(undefined);
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ playerUrl: player.webUrl, season: String(season) });
    fetch(`/api/foxsports/players/gamelogs?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Game logs unavailable (${response.status})`);
        return response.json() as Promise<Gamelog>;
      })
      .then(data => { if (!controller.signal.aborted) setGameLog(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Failed to load game logs"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [player?.webUrl, season]);
  return { gameLogs, loading, error };
}
