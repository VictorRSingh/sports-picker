import { TeamStats } from "@/types/TeamStats";
import React from "react";

interface StatsPreviewProps {
  teamStats?: TeamStats[] | null;
}
const StatsPreview = ({ teamStats }: StatsPreviewProps) => {
  return (
    <div className="lg:w-3/4 mx-auto rounded w-full space-y-8 p-4 ">
      {teamStats && teamStats.length > 0 ? (
        teamStats.map((stat, idx) => {
          // Check if any row has a leader (assuming leader is in a column named 'leader')
          const hasLeader = stat.rows.some((row) =>
            row.columns.some((col) => col.text && col.text !== "")
          );
          return (
            <div key={idx} className="rounded shadow">
              <h2 className="font-bold text-2xl mb-2">{stat.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stat.rows.map((row, rIdx) => (
                  <div
                    key={`${rIdx}-${stat.category}`}
                    className="border rounded shadow p-4 flex flex-col items-center"
                  >
                    {row.columns.map((col, cIdx) => (
                      <React.Fragment key={cIdx}>
                        {col.text && col.text.startsWith("http") ? (
                          <img
                            src={col.text}
                            alt="leader"
                            className="w-10 h-10 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <span className="font-medium">{col.text}</span>
                        )}
                        <div className="mb-2 w-full flex items-center" />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 text-center">No stats available.</div>
      )}
    </div>
  );
};

export default StatsPreview;
