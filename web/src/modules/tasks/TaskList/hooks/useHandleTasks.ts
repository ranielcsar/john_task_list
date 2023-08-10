import { useTasksStore } from "../../store"

export function useHandleTasks() {
  const taskToEdit = useTasksStore((state) => state.taskToEdit)
  const setTaskToEdit = useTasksStore((state) => state.setTaskToEdit)
  const setTaskToDelete = useTasksStore((state) => state.setTaskToDelete)
  const taskToDelete = useTasksStore((state) => state.taskToDelete)

  return { taskToEdit, setTaskToEdit, taskToDelete, setTaskToDelete }
}