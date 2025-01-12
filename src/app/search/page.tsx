"use client";
import PlayerSearch from "@/components/player/PlayerSearch";
import { Player } from "@/interfaces/Player";
import React, { useEffect, useState } from "react";
import PlayerSearchButton from "@/components/player/PlayerSearchButton";

const search = () => {
  const [playersArray, setPlayersArray] = useState<Player[] | null>([]);
  useEffect(() => {
    playersArray && console.log(playersArray);
  }, [playersArray]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="p-4 min-w-80">
        <div className="">
          <PlayerSearch
            playersArray={playersArray}
            setPlayersArray={setPlayersArray}
          />
        </div>
      </div>
      <div className="flex-grow p-4">
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playersArray && playersArray.length > 0 ? (
              <div className="flex flex-col">
                <h1>Top Result:</h1>
                <PlayerSearchButton player={playersArray[0]} />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="">
            {playersArray && playersArray.length > 0 ? (
              <>
                <h1>Related Results:</h1>
                <PlayerSearchButton playersArray={playersArray} />
              </>
            ) : (
              <>No players Found</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default search;
