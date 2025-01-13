import { Filters } from '@/interfaces/Filters'
import React, { Dispatch, SetStateAction } from 'react'
import Filter from '../filters/Filter';

export interface playerPageFiltersProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const PlayerPageFilters = ({ filters, setFilters }: playerPageFiltersProps) => {

  const numberOfGames = [
    {
      size: 0,
      name: "All games"
    },
    {
      size: 5,
      name: "Last 5 Games"
    },
    {
      size: 10,
      name: "Last 10 Games"
    }
  ];
  
  return (
    <div>
      <Filter filters={filters} setFilters={setFilters} filterName='Number Of Games' filterConditions={numberOfGames} target={'dataSetSize'}/>
    </div>
  )
}

export default PlayerPageFilters