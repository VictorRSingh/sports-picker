import { Roster } from "@/types/Roster";
import React from "react";
import { useRouter } from "next/navigation";

interface RosterPreviewProps {
  roster: Roster;
}

const RosterPreview = ({ roster }: RosterPreviewProps) => {
  const router = useRouter();
  return (
    <div className="lg:w-3/4 mx-auto rounded w-full space-y-4 p-4">
      <h2 className="text-2xl font-bold">Roster</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-h-80 lg:max-h-full overflow-y-auto">
        {roster.players.map((player, index) => (
          <div
            key={`${player.name}`}
            className="col-span-full lg:col-span-1 rounded border p-2 flex justify-between items-center max-h-32 cursor-pointer"
            onClick={() => router.push(`/p/${player.webUrl}`)}
          >
            <img src={player.image} width={50} />
            <div className="flex-col w-full p-2">
              <div className="flex gap-x-2 items-center">
                <h1 className="text-lg font-bold">{player.name}</h1>
                <p className="text-sm text-gray-400">
                  #{player.details?.number}
                </p>
              </div>
              <h2 className="text-sm uppercase text-gray-500 font-semibold">
                {player.details?.position}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterPreview;
