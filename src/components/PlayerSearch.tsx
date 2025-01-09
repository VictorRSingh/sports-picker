import usePlayer from "@/hooks/usePlayer";
import { Player } from "@/interfaces/Player";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaSearch, FaCheck } from "react-icons/fa";

interface PlayerSearchProps {
  player: Player | null;
  setPlayer: Dispatch<SetStateAction<Player | null>>;
}

const PlayerSearch = ({setPlayer}: PlayerSearchProps) => {
  const [playerQuery, setPlayerQuery] = useState<string>("");
  const { fetchPlayer } = usePlayer(playerQuery, setPlayer)
  const handleSubmit = () => {
    fetchPlayer(); // Trigger fetch when the button is clicked
  };

  return (
    <div className="flex">
      <div className="flex items-center border rounded bg-white">
        <div className="px-1 bg-white h-full flex items-center text-black">
          <FaSearch className="" />
        </div>
        <input
          className="text-black"
          value={playerQuery} // Bind inputValue to the input
          onChange={(e) => setPlayerQuery(e.target.value)} // Update local state onChange
          placeholder="Player Search"
        />
        <button
          className="bg-green-500 h-full w-6 flex justify-center items-center"
          onClick={handleSubmit}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );
};

export default PlayerSearch;
