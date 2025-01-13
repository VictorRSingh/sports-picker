"use client";

import PlayerCard from "@/components/player/PlayerCard";
import PlayerGameLogs from "@/components/player/PlayerGameLogs";
import PlayerGraphView from "@/components/player/PlayerGraphView";
import PlayerPageFilters from "@/components/player/PlayerPageFilters";
import useGameLog from "@/hooks/useGameLog";
import { Filters } from "@/interfaces/Filters";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const PlayerPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const image = searchParams.get("image");
  const webUrl = searchParams.get("webUrl");
  const { gameLogs } = useGameLog(webUrl);
  if (!name) return <p>Loading...</p>;

  const [filters, setFilters] = useState<Filters>({
    dataSetSize: 0,
  });

  return (
    <>
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col items-center p-4">
          {name && image && <PlayerCard name={name} image={image} />}
          <PlayerPageFilters filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-grow h-full border-l p-4">
          {gameLogs && (
            <>
              <PlayerGameLogs
                gameLogs={{
                  headers: gameLogs.headers,
                  rows: gameLogs.rows.slice(
                    0,
                    filters.dataSetSize === 0
                      ? gameLogs.rows.length
                      : filters.dataSetSize
                  ),
                }}
                filters={filters}
              />
              <div className="flex justify-center">
                <PlayerPageFilters filters={filters} setFilters={setFilters} />
              </div>
              <PlayerGraphView
                gameLogs={{
                  headers: gameLogs.headers,
                  rows: gameLogs.rows
                    .slice(
                      0,
                      filters.dataSetSize === 0
                        ? gameLogs.rows.length
                        : filters.dataSetSize
                    )
                    .reverse(),
                }}
                filters={filters}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerPage;
