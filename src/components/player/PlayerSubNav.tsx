import { PlayerSubnavLinksEnum } from "@/enums/PlayerSubnavLinksEnum";
import React, { Dispatch, SetStateAction } from "react";

type PlayerSubNavProps = {
  activeTab: PlayerSubnavLinksEnum;  // ✅ Now correctly using the enum type
  setActiveTab: Dispatch<SetStateAction<PlayerSubnavLinksEnum>>;
};

const PlayerSubNav: React.FC<PlayerSubNavProps> = ({ activeTab, setActiveTab }) => {
  const buttonStyle = "px-4 py-1 rounded-full border min-w-fit";
  const buttonStyleActive = "bg-white text-black font-semibold";

  return (
    <div className="flex space-x-4 overflow-hidden overflow-x-auto min-h-fit py-2">
      {Object.values(PlayerSubnavLinksEnum).map((value) => (
        <button
          key={value}
          className={`${buttonStyle} ${activeTab === value ? buttonStyleActive : ""}`}
          onClick={() => setActiveTab(value as PlayerSubnavLinksEnum)}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PlayerSubNav;
