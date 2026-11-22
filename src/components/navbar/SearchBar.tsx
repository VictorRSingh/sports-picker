"use client";
import { useSearch } from "@/hooks/useSearch";
import { useEffect,useState } from "react";
import SearchField from "./SearchField";
export default function SearchBar(){const [query,setQuery]=useState("");const [showSearch,setShowSearch]=useState(false);const {searchResults,fetchSearchResults}=useSearch(query);useEffect(()=>{if(query.length>3)fetchSearchResults();},[query]);return <div className="relative w-full"><SearchField query={query} searchResults={searchResults!} setQuery={setQuery} showSearch={showSearch} setShowSearch={setShowSearch}/></div>}
