import { TaskProps } from "@/types"

export function handleInProgressTasks(tasks: TaskProps[]) {
  const inProgressTasks = tasks.filter((task) => {
    if (task.subtasks?.length !== 0 && !task.hasCompleted) {
      const allSubtasksHasCompleted = task.subtasks?.map((subtask) => subtask.hasCompleted)

      if (
        allSubtasksHasCompleted?.some((value) => !value) &&
        !allSubtasksHasCompleted?.every((value) => !value)
      ) {
        return task
      }
    }
  })

  return inProgressTasks
}