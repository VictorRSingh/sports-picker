import { SearchResults } from "@/types/SearchResults";
import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
interface SerachFieldProps {
  searchResults: SearchResults;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
}

const SearchField = ({
  searchResults,
  query,
  setQuery,
  showSearch,
  setShowSearch,
}: SerachFieldProps) => {
  const router = useRouter();

  return (
    <div className="relative w-full mt-4 lg:mt-0">
      <input
        type="text"
        className="bg-gray-600 rounded px-4 py-2 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Players or Teams"
      />
      {searchResults && query.length > 2 && (
        <div className="absolute top-11 p-2 bg-gray-600 w-full text-base border-t">
          {searchResults.players.length > searchResults.teams.length ? (
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <h1 className="font-semibold text-gray-400">PLAYERS</h1>
                {searchResults.players.slice(0, 3).map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => {
                      setShowSearch(false);
                      setQuery("");
                      router.push(player.webUrl);
                    }}
                  >
                    <img src={player.image} width={40} />
                    <h1>{player.name}</h1>
                  </div>
                ))}
              </div>
              {searchResults.teams.length > 0 && (
                <div>
                  <h1 className="font-semibold text-gray-400">TEAMS</h1>
                  {searchResults.teams.slice(0, 3).map((team, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-4 cursor-pointer"
                      onClick={() => {
                        setShowSearch(false);
                        setQuery("");
                        router.push(team.webUrl);
                      }}
                    >
                      <img src={team.image} width={40} />
                      <h1>{team.name}</h1>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-y-4">
              <div>
                <h1 className="font-semibold text-gray-400">TEAMS</h1>
                {searchResults.teams.slice(0, 3).map((team, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => {
                      setShowSearch(false);
                      setQuery("");
                      router.push(team.webUrl);
                    }}
                  >
                    <img src={team.image} width={40} />
                    <h1>{team.name}</h1>
                  </div>
                ))}
              </div>
              {searchResults.players.length > 0 && (
                <div className="flex flex-col gap-y-2">
                  <h1 className="font-semibold text-gray-400">PLAYERS</h1>
                  {searchResults.players.slice(0, 3).map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-4 cursor-pointer"
                      onClick={() => {
                        setShowSearch(false);
                        setQuery("");
                        router.push(player.webUrl);
                      }}
                    >
                      <img src={player.image} width={40} />
                      <h1>{player.name}</h1>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchField;
