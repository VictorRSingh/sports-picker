import React, { Dispatch, SetStateAction } from "react";
import { FaSearch, FaCheck } from "react-icons/fa";

interface PlayerSearchProps {
    player: string,
    setPlayer: Dispatch<SetStateAction<string>>;
    fetchPlayer: () => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({player, setPlayer, fetchPlayer}) => {

  const handleSubmit = () => {
    fetchPlayer(); // Trigger the fetch when Submit is clicked
  };

  return (
    <div className="flex">
      <div className="flex items-center border rounded bg-white">
        <div className="px-1 bg-white h-full flex items-center text-black">
          <FaSearch className="" />
        </div>
        <input
          className="text-black"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
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
