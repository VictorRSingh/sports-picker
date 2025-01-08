import usePlayer from "@/hooks/usePlayer";
import { Player } from "@/interfaces/Player";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { FaSearch, FaCheck } from "react-icons/fa";

interface PlayerSearchProps {
  setPlayerObject: any;
  playerObject: Player
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ playerObject, setPlayerObject}) => {
    const { player, setPlayer, fetchPlayer } = usePlayer(playerObject, setPlayerObject);
  const [inputValue, setInputValue] = useState(player); // Local state for input

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setPlayer(inputValue); // Update parent state after delay
    }, 800); // Debounce delay in ms

    return () => clearTimeout(handler); // Cleanup timeout on value change
  }, [inputValue, setPlayer]);

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
          value={inputValue} // Bind inputValue to the input
          onChange={(e) => setInputValue(e.target.value)} // Update local state onChange
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
