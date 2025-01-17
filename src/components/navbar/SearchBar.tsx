"use client";

import { useSearch } from "@/hooks/useSearch";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import SearchField from "./SearchField";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const { searchResults, fetchSearchResults } = useSearch(query);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useEffect(() => {
    if (query.length > 3) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="flex w-full md:w-fit justify-end">
      <div className="flex md:hidden text-2xl px-4">
        {showSearch ? (
          <MdOutlineClose onClick={() => {
            setShowSearch(!showSearch)
            setQuery("");
          }} />
        ) : (
          <FaSearch onClick={() => setShowSearch(!showSearch)} />
        )}
        {showSearch && (
          <div className="absolute top-20 left-0 w-full">
            <SearchField
              query={query}
              searchResults={searchResults!}
              setQuery={setQuery}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        )}
      </div>
      <div className="hidden md:flex text-xl px-4 gap-x-2 items-center">
        <SearchField
          query={query}
          searchResults={searchResults!}
          setQuery={setQuery}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />
        <FaSearch />
      </div>
    </div>
  );
};

export default SearchBar;
