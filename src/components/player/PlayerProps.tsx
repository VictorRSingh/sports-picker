"use client";

import { useState } from "react";
import type { PlayerProps } from "@/types/PlayerProps";

interface Props {
  playerProps: PlayerProps[];
  loading?: boolean;
  error?: string;
  sourceUrl?: string;
  onSelect?: (market: string, line: string, odds: string, side: "over" | "under", sportsbook: string) => void;
}

export default function PlayerPropsPage({ playerProps, loading, error, sourceUrl, onSelect }: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // Use the market name and its position so duplicate names remain navigable.
  const tabs = playerProps.map((market, index) => ({ market, key: `${market.market}-${index}` }));
  const active = tabs.find((tab) => tab.key === selectedKey) ?? tabs[0];

  return (
    <section className="dashboard-panel p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Covers sportsbook markets</h2>
          <p className="mt-1 text-xs theme-muted">Select a market to view available lines and odds.</p>
        </div>
        {sourceUrl && (
          <a className="text-xs text-violet-300 hover:underline" href={sourceUrl} target="_blank" rel="noopener noreferrer">
            View source ↗
          </a>
        )}
      </div>

      {loading && <p role="status" className="text-xs theme-muted">Looking up player markets…</p>}
      {error && <p role="status" className="text-xs text-amber-300">{error}</p>}
      {!loading && !error && !tabs.length && (
        <p className="text-xs theme-muted">No sportsbook markets currently available.</p>
      )}

      {tabs.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-[minmax(190px,260px)_minmax(0,1fr)] lg:grid-cols-[minmax(220px,290px)_minmax(0,1fr)]">
            <nav aria-label="Sportsbook market categories" className="min-w-0 md:border-r md:pr-4 theme-border">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide theme-muted">Market types</p>
              <div role="tablist" aria-label="Sportsbook prop markets" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 md:max-h-[650px] md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0 md:pr-1">
                {tabs.map(({ market, key }, index) => (
                  <button
                    key={key}
                    id={`covers-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={active.key === key}
                    aria-controls="covers-market-panel"
                    onClick={() => setSelectedKey(key)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors md:w-full md:shrink ${
                      active.key === key
                        ? "border-violet-400 bg-violet-500/20 text-violet-200"
                        : "theme-border theme-surface-raised theme-muted hover:border-violet-400/50 hover:text-violet-200"
                    }`}
                  >
                    <span className="whitespace-nowrap md:whitespace-normal">{market.market}</span>
                    <span className="shrink-0 rounded-full bg-black/20 px-2 py-0.5 text-[10px] opacity-80">
                      {market.props.length}
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            <div id="covers-market-panel" role="tabpanel" aria-labelledby={`covers-tab-${tabs.findIndex(tab => tab.key === active.key)}`} className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{active.market.market}</h3>
                <span className="text-xs theme-muted">{active.market.props.length} sportsbook listings</span>
              </div>
              <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {active.market.props.map((prop, index) => (
                  <div key={`${prop.sportsbook.name}-${index}`} className="min-w-0 rounded-lg theme-surface-raised border theme-border p-3">
                    <p className="mb-3 text-xs font-medium theme-muted">{prop.sportsbook.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {(["over", "under"] as const).map((side) => {
                        const quote = prop[side];
                        if (!quote.line) return null;
                        return (
                          <button
                            type="button"
                            key={side}
                            className="rounded-md border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-xs transition-colors hover:bg-violet-500/20"
                            onClick={() => onSelect?.(active.market.market, quote.line, quote.odd, side, prop.sportsbook.name)}
                          >
                            {side === "over" ? "Over" : "Under"} {quote.line} · {quote.odd || "odds unavailable"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <p className="text-xs theme-muted">Covers listings may be unavailable or stale. Confirm the game date, line and odds with the sportsbook before analyzing.</p>
    </section>
  );
}
