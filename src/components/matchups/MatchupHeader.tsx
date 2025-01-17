import React from "react";

const MatchupHeader = () => {
  return (
    <div className="grid grid-cols-4 w-full">
      <div className="col-span-1 uppercase text-xs text-center"></div>
      <div className="col-span-1 uppercase text-xs text-center text-gray-500">
        Spread
      </div>
      <div className="col-span-1 uppercase text-xs text-center text-gray-500">
        Moneyline
      </div>
      <div className="col-span-1 uppercase text-xs text-center text-gray-500">
        Total
      </div>
    </div>
  );
};

export default MatchupHeader;
