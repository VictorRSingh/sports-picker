"use client";

import PlayerGameLogs from "@/components/player/PlayerGameLogs";
import PlayerGraphView from "@/components/player/PlayerGraphView";
import PlayerPageFilters from "@/components/player/PlayerPageFilters";
import useGameLog from "@/hooks/useGameLog";
import { Filters } from "@/interfaces/Filters";
import { GameLog } from "@/interfaces/GameLog";
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
    dataSetSize: gameLogs?.rows.length!,
  });

  useEffect(() => {
    if (gameLogs) {
      setFilters((...prev) => ({
        ...prev,
        dataSetSize: gameLogs?.rows.length,
      }));
    }
  }, [gameLogs]);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="p-4 min-w-60 border-b md:border-b-0 md:border-r flex flex-col gap-y-4 h-full">
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
            <PlayerPageFilters />
          </div>
        </div>
        <div className="flex flex-col max-w-full overflow-auto p-8 gap-y-4">
          {gameLogs && (
            <>
              <PlayerGameLogs gameLogs={gameLogs} filters={filters} />
              <PlayerGraphView gameLogs={gameLogs} filters={filters} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerPage;
