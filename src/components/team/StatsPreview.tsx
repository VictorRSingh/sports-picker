import { TeamStats } from "@/types/TeamStats";
import React from "react";

interface StatsPreviewProps {
  teamStats?: TeamStats[] | null;
}

const colors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-yellow-500",
  "bg-red-500",
];

const StatsPreview = ({ teamStats }: StatsPreviewProps) => {
  return (
    <div className="mx-auto w-full h-full space-y-10 p-6 flex flex-col">
      {teamStats && teamStats.length > 0 ? (
        teamStats.map((stat, idx) => (
          <div
            key={idx}
          >
            <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-8 bg-blue-600 rounded-full"></span>
              {stat.category.toLocaleLowerCase().charAt(0).toUpperCase() + stat.category.slice(1).toLocaleLowerCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-96 lg:max-h-full overflow-y-auto">
              {stat.rows.map((row, rIdx) => (
                <div
                  key={`${rIdx}-${stat.category}`}
                  className="rounded-lg border border-gray-100 p-4 flex flex-col items-center space-y-2"
                >
                  {row.columns.map((col, cIdx) => (
                    <React.Fragment key={cIdx}>
                      {col.text && col.text.startsWith("http") ? (
                        <img
                          src={col.text}
                          alt="leader"
                          className="w-14 h-14 rounded-full object-cover border-4 border-blue-200 mb-2"
                        />
                      ) : (
                        <span
                          className={`font-semibold text-center ${
                            cIdx === 0 ? "text-lg text-blue-700" : ""
                          }`}
                        >
                          {col.text}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center">No stats available.</div>
      )}
    </div>
  );
};

export default StatsPreview;
