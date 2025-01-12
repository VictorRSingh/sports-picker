import usePlayer from "@/hooks/usePlayer";
import { Player } from "@/interfaces/Player";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaSearch, FaCheck } from "react-icons/fa";
import { IoBackspaceOutline } from "react-icons/io5";

interface PlayerSearchProps {
  playersArray: Player[] | null;
  setPlayersArray: Dispatch<SetStateAction<Player[] | null>>;
}

const PlayerSearch = ({ setPlayersArray }: PlayerSearchProps) => {
  const [playerQuery, setPlayerQuery] = useState<string>("");
  const { fetchPlayer } = usePlayer(playerQuery, setPlayersArray);
  const handleSubmit = () => {
    fetchPlayer(); // Trigger fetch when the button is clicked
  };

  return (
    <div className="flex w-full">
      <div className="flex items-center border rounded bg-white w-full">
        <div className="px-1 bg-white h-full flex items-center text-black">
          <FaSearch className="" />
        </div>
        <input
          className="text-black w-full h-10"
          value={playerQuery} // Bind inputValue to the input
          onChange={(e) => setPlayerQuery(e.target.value)} // Update local state onChange
          placeholder="Player Search"
        />
        <button
          className="bg-red-500 h-full w-20 flex justify-center items-center"
          onClick={() => setPlayerQuery("")}
        ><IoBackspaceOutline /></button>
        <button
          className="bg-green-500 h-full w-20 flex justify-center items-center"
          onClick={handleSubmit}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );
};

export default PlayerSearch;
