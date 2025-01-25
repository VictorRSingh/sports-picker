import { PlayerProps } from "@/types/PlayerProps";
import React, { useEffect } from "react";

interface PlayerPropsPageProps {
  playerProps: PlayerProps[];
}

const PlayerPropsPage = ({ playerProps }: PlayerPropsPageProps) => {
  useEffect(() => {
    console.log(playerProps);
  }, [playerProps]);
  return (
    <div className="flex flex-col gap-4 bg-gray-500 p-2 rounded">
      {playerProps &&
        playerProps.map((prop, index) => (
          <div
            key={index + prop.market}
            className="flex flex-col p-3 border bg-white text-black rounded shadow-lg w-full text-xs"
          >
            <h1 className="font-bold">{prop.market}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 max-w-full overflow-x-auto gap-2">
              {prop.props.map((p, index) => (
                <div
                  key={index + p.sportsbook.name}
                  className="col-span-1 flex items-center justify-between border p-2 rounded shadow-md"
                >
                  <img src={p.sportsbook.imageUrl} width={60} />
                  <div className="flex flex-col gap-y-1">
                    {p.over.line && (
                      <div className="flex gap-x-2 border rounded-full px-2 py-1">
                        <p>
                          {`${p.under.line ? "o" : "Yes "}`}
                          {p.over.line}
                        </p>
                        <p>{p.over.odd}</p>
                      </div>
                    )}
                    {p.under.line && (
                      <div className="flex gap-x-2 border rounded-full px-2 py-1">
                        <p>
                          {`${p.over.line ? "u" : "No "}`}
                          {p.under.line}
                        </p>
                        <p>{p.under.odd}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default PlayerPropsPage;
