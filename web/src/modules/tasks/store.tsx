import { TaskProps } from '@/types'
import { create } from 'zustand'

export type FilterOptions = 'All tasks' | 'In progress' | 'Completed'

export type TaskStoreProps = {
  taskToEdit: TaskProps | null
  setTaskToEdit(task: TaskProps | null): void

  taskToDelete: TaskProps | null
  setTaskToDelete(task: TaskProps | null): void

  selectedFilter: FilterOptions | null
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
