import React from "react";

type PlayerSubNavProps = {
  activeTab: "stats" | "gamelog"; // Narrow down to "stats" and "gamelog"
  setActiveTab: (tab: "stats" | "gamelog") => void; // Narrow down as well
};

const PlayerSubNav: React.FC<PlayerSubNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex space-x-4">
      <button
        className={`px-4 py-1 rounded-full border ${
          activeTab === "stats" ? "bg-white text-black" : ""
        }`}
        onClick={() => setActiveTab("stats")}
      >
        Stats
      </button>
      <button
        className={`px-4 py-1 rounded-full border ${
          activeTab === "gamelog" ? "bg-white text-black" : ""
        }`}
        onClick={() => setActiveTab("gamelog")}
      >
        Game Log
      </button>
    </div>
  );
};

export default PlayerSubNav;
