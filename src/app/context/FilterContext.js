import { useState, createContext, useEffect, useMemo } from "react";
const context = {};

export const FilterContext = createContext(context);

export function FilterContextProvider(props) {
  const [filterState, setFilterState] = useState({
    selectedFilters: [],
    selectedBrands: [],
    selectedCategories: [],
    max_price: null,
    min_price: null,
    sort_by: "",
  });

  return (
    <FilterContext.Provider value={[filterState, setFilterState]}>
      {props.children}
    </FilterContext.Provider>
  );
}
