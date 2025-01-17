import { SearchResults } from "@/types/SearchResults";
import axios from "axios";
import { useState } from "react";

export function useSearch(query: string) {
  const [searchResults, setSearchResults] = useState<SearchResults>();

  const fetchSearchResults = async () => {
    try {
        if(query.length < 3) {
            return;
        }
        const response = await axios.get(`/api/foxsports/search?q=${query}`);
        const data = await response.data;
    
        if (data) {
          setSearchResults(data);
        }
        
    } catch (error) {
        console.error("Failed to fetch results", error);
    }
  };

  return { searchResults, fetchSearchResults };
}
