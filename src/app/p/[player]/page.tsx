"use client";

import PlayerGameLogs from "@/components/player/PlayerGameLogs";
import PlayerGraphView from "@/components/player/PlayerGraphView";
import PlayerPageFilters from "@/components/player/PlayerPageFilters";
import useGameLog from "@/hooks/useGameLog";
import { Filters } from "@/interfaces/Filters";
import { headers } from "next/headers";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="p-4 min-w-60 flex flex-col gap-y-4 h-fit">
          <div className="flex flex-col items-center  gap-y-4">
            <div className="flex flex-col items-center">
              {image && (
                <img
                  src={image}
                  width={150}
                  className="border rounded-full bg-white"
                />
              )}
              {name && <h1 className="text-2xl">{name}</h1>}
            </div>
            <PlayerPageFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>
        <div className="flex flex-col max-w-full overflow-auto p-8 gap-y-4 border-t md:border-t-0 md:border-l h-full">
          {gameLogs && <>
            <>
              <PlayerGameLogs gameLogs={{
                headers: gameLogs.headers,
                rows: gameLogs.rows.slice(0, filters.dataSetSize === 0 ? gameLogs.rows.length : filters.dataSetSize)
              }} filters={filters} />
              <PlayerGraphView gameLogs={{
                headers: gameLogs.headers,
                rows: gameLogs.rows.slice(0, filters.dataSetSize === 0 ? gameLogs.rows.length : filters.dataSetSize)
              }} filters={filters} />
            </>
          </>}
        </div>
      </div>
    </>
  );
};

export default PlayerPage;
