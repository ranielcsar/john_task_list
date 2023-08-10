import { create } from 'zustand'

import { TaskProps } from '@/types'

export type FilterOptions = 'All tasks' | 'In progress' | 'Completed'

export type TaskStoreProps = {
  taskToEdit: TaskProps | null
  // eslint-disable-next-line no-unused-vars
  setTaskToEdit(task: TaskProps | null): void

  taskToDelete: TaskProps | null
  // eslint-disable-next-line no-unused-vars
  setTaskToDelete(task: TaskProps | null): void

  selectedFilter: FilterOptions | null
  // eslint-disable-next-line no-unused-vars
  setSelectedFilter(filter: FilterOptions): void
}

export const useTasksStore = create<TaskStoreProps>((set) => ({
  taskToEdit: null,
  setTaskToEdit: (task: TaskProps | null) => set({ taskToEdit: task }),

  taskToDelete: null,
  setTaskToDelete: (task: TaskProps | null) => set({ taskToDelete: task }),

  selectedFilter: 'All tasks',
  setSelectedFilter: (filter: FilterOptions) => set({ selectedFilter: filter }),
}))
