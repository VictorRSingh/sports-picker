import { Player } from "@/interfaces/Player";
import React from "react";
import { useRouter } from "next/navigation";
import { MdOutlineArrowOutward } from "react-icons/md";

interface PlayerSearchButtonProps {
  playersArray?: Player[];
  player?: Player;
}

const PlayerSearchButton = ({
  player,
  playersArray,
}: PlayerSearchButtonProps) => {
  const router = useRouter();
  console.log(player);
  return (
    <>
{player ? (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div
      key={player.webUrl}
      className="col-span-1 md:col-span-4 w-full"
    >
      <div
        className="grid grid-cols-[auto,1fr,auto] border rounded p-2 gap-x-2 w-full items-center cursor-pointer"
        onClick={() => router.push(`/p/${player.webUrl.split("/")[2]}?webUrl=${player.webUrl}&name=${player.name}&image=${player.image}&sport=${player.sport}`)}
      >
        <img className="col-span-1" src={player.image} width={40} />
        <div className="flex flex-col text-sm min-h-16 justify-center">
          <h1 className="w-full font-bold">{player.name}</h1>
          <p className="w-full text-gray-600 font-semibold">{player.team}</p>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <MdOutlineArrowOutward />
        </div>
      </div>
    </div>
  </div>
) : (
  playersArray && (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {playersArray.slice(1, playersArray.length).map((player, index) => (
        <div key={player.webUrl} className="col-span-1 w-full">
          <div
            className="grid grid-cols-[auto,1fr,auto] border rounded p-2 gap-x-2 w-full items-center cursor-pointer"
            onClick={() => router.push(`/p/${player.webUrl.split("/")[2]}?webUrl=${player.webUrl}&name=${player.name}&image=${player.image}&sport=${player.sport}`)}
          >
            <img className="col-span-1" src={player.image} width={40} />
            <div className="flex flex-col text-sm min-h-16 justify-center">
              <h1 className="w-full font-bold">{player.name}</h1>
              <p className="w-full text-gray-600 font-semibold">{player.team}</p>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <MdOutlineArrowOutward />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
)}
    </>
  );
};

export default PlayerSearchButton;
