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
    <div className="relative w-full">
      <input
        type="text"
        className="w-full rounded-lg border theme-border theme-surface-raised/80 px-4 py-2 text-sm theme-text outline-none placeholder:theme-muted focus:theme-border-accent"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Players or Teams"
      />
      {searchResults && query.length > 2 && (
        <div className="absolute top-12 z-50 w-full rounded-xl border theme-border theme-surface p-3 text-sm shadow-2xl">
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
                      router.push(`/p/${player.webUrl}`);
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
                        router.push(`/t/${team.webUrl}`);
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
                      router.push(`/t/${team.webUrl}`);
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
                        router.push(`/p/${player.webUrl}`);
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
