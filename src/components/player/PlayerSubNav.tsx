import React from "react";

type PlayerSubNavProps = {
  activeTab: "stats" | "gamelog" | "analytics" | "ai"; // Narrow down to "stats" and "gamelog"
  setActiveTab: (tab: "stats" | "gamelog" | "analytics" | "ai") => void; // Narrow down as well
};

const PlayerSubNav: React.FC<PlayerSubNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const buttonStyle = "px-4 py-1 rounded-full border min-w-fit";
  const buttonStyleActive = "bg-white text-black font-semibold";
  return (
    <div className="flex space-x-4 overflow-hidden overflow-x-auto min-h-fit py-2">
      <button
        className={`${buttonStyle} ${
          activeTab === "stats" ? buttonStyleActive : ""
        }`}
        onClick={() => setActiveTab("stats")}
      >
        Stats
      </button>
      <button
        className={`${buttonStyle} ${
          activeTab === "gamelog" ? buttonStyleActive  : ""
        }`}
        onClick={() => setActiveTab("gamelog")}
      >
        Game Log
      </button>
      <button
        className={`${buttonStyle} ${
          activeTab === "analytics" ? buttonStyleActive  : ""
        }`}
        onClick={() => setActiveTab("analytics")}
      >
        Analytics
      </button>
      <button
        className={`${buttonStyle} ${
          activeTab === "ai" ? buttonStyleActive  : ""
        }`}
        onClick={() => setActiveTab("ai")}
      >
        Ai Projections
      </button>
    </div>
  );
};

export default PlayerSubNav;
