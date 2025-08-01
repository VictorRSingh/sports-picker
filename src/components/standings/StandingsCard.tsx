import { useStandings } from "@/hooks/useStandings";
import { Standing } from "@/types/Standing";
import React from "react";

type StandingsCardProps = {
  sport: string;
};

const StandingsCard = ({ sport }: StandingsCardProps) => {
  const standings = useStandings(sport); // this is an array of Standing[]

  if (standings != null) {
    return (
      <div className="p-4">
        {Array.isArray(standings) ? (
          <div className="w-full">
            <h1 className="text-2xl font-bold">Divisional Standings</h1>
            <ul
              className={`grid mt-4 gap-4 ${
                standings.length === 1
                  ? "grid-cols-1"
                  : standings.length === 2
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1 lg:grid-cols-3"
              }`}
            >
              {standings.map((division, divIndex) => (
                <div key={divIndex} className="mb-6 text-xs">
                  <h2 className="text-lg font-bold mb-4">
                    {division.division}
                  </h2>
                  <div className="overflow-x-auto max-h-72">
                    <table className="min-w-full border">
                      <thead className="sticky -top-1 bg-neutral-950 z-10">
                        <tr>
                          <th className="px-4 py-2 text-left border-b">#</th>
                          <th className="px-4 py-2 text-left border-b">Team</th>
                          {division.headers.map(
                            (header: any, index: number) => (
                              <th
                                key={index}
                                className="px-4 py-2 text-left border-b"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {division.rows.map((row: any, index: number) => {
                          return (
                            <tr key={index} className="">
                              <td className="px-4 py-2 border-b">{row.rank}</td>
                              <td className="px-4 py-2 border-b hover:scale-150 transition-transform duration-200">
                                <a
                                  href={row.teamUrl}
                                  className="flex items-center space-x-2"
                                >
                                  <img
                                    src={row.logo}
                                    alt={`${row.team} logo`}
                                    className="w-6 h-6" />
                                  <span>{row.team}</span>
                                </a>
                              </td>
                              {division.headers.map(
                                (header: any, headerIndex: number) => (
                                  <td
                                    key={headerIndex}
                                    className="px-4 py-2 border-b"
                                  >
                                    {row[header]}
                                  </td>
                                )
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading standings...</p>
        )}
      </div>
    );
  }
};

export default StandingsCard;
