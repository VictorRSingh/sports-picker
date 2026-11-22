import type { PlayerProps } from "@/types/PlayerProps";
import { useCallback, useEffect, useRef, useState } from "react";

export function useProps(query: string, name = "", team = "") {
  const [playerProps, setPlayerProps] = useState<PlayerProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const requestId = useRef(0);
  const fetchPlayerProps = useCallback(async () => {
    const id = ++requestId.current;
    if (!query) { setPlayerProps([]); setSourceUrl(""); setError(""); return; }
    const parts = query.split("/").filter(Boolean);
    if (parts.length < 2) return;
    setLoading(true); setError(""); setPlayerProps([]); setSourceUrl("");
    try {
      const params = new URLSearchParams({ sport: parts[0], player: parts[1] });
      if (name) params.set("name", name);
      if (team) params.set("team", team);
      const search = await fetch(`/api/google/search?${params.toString()}`);
      const discovery = await search.json();
      if (!search.ok || typeof discovery.url !== "string") throw new Error(discovery.error || "Could not find Covers player page");
      const response = await fetch(`/api/covers/props?url=${encodeURIComponent(discovery.url)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load Covers markets");
      if (id !== requestId.current) return;
      const markets = Array.isArray(data.markets) ? data.markets : [];
      setSourceUrl(data.source || discovery.url);
      setPlayerProps(markets);
      setError(markets.length ? "" : (data.note || "No current markets found"));
    } catch (err) { if (id === requestId.current) setError(err instanceof Error ? err.message : "Props unavailable"); }
    finally { if (id === requestId.current) setLoading(false); }
  }, [query, name, team]);
  useEffect(() => { void fetchPlayerProps(); }, [fetchPlayerProps]);
  return { playerProps, fetchPlayerProps, loading, error, sourceUrl };
}
