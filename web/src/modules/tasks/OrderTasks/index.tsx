'use client'
import { Button } from '@/components/Button'

import { FilterOptions, useTasksStore } from '../store'

export function OrderTasks() {
  const filters: FilterOptions[] = ['All tasks', 'In progress', 'Completed']
  const setSelectedFilter = useTasksStore((state) => state.setSelectedFilter)
  const selectedFilter = useTasksStore((state) => state.selectedFilter)

  return (
    <>
      {filters.map((filter) => (
        <Button
          className={`min-w-[7rem] rounded-full border border-black bg-transparent p-2 hover:bg-black hover:text-white ${
            filter === selectedFilter ? 'bg-black text-white' : 'bg-white text-black'
          }`}
          key={filter}
          onClick={() => setSelectedFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </>
  )
}
