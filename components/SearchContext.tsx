"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext<any>(null);
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}
export const useSearch = () => useContext(SearchContext);
