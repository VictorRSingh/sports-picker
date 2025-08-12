import { Roster } from "@/types/Roster";
import React from "react";
import { useRouter } from "next/navigation";

interface RosterPreviewProps {
  roster: Roster;
}

const RosterPreview = ({ roster }: RosterPreviewProps) => {
  const router = useRouter();
  if (roster) return (
    <div className="mx-auto w-full space-y-6 p-6 max-h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-8 bg-blue-600 rounded-full"></span>
        Roster ({roster.playerCount})
      </h2>
      <div className="grid grid-cols-1 gap-6 max-h-96 lg:max-h-full overflow-y-auto">
        {roster.players.map((player) => (
          <div
            key={player.name}
            className="rounded-xl border border-gray-200 p-4 flex flex-col items-center shadow hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => router.push(`/p/${player.webUrl}`)}
          >
            <div className="relative w-20 h-20 mb-3">
              <img
                src={player.image}
                alt={player.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                #{player.details?.number}
              </span>
            </div>
            <h1 className="text-lg font-semibold text-center">{player.name}</h1>
            <h2 className="text-xs uppercase text-blue-600 font-bold tracking-wide text-center mt-1">
              {player.details?.position}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterPreview;
