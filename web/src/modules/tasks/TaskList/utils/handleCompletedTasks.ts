import { TaskProps } from "@/types"

export function handleCompletedTasks(tasks: TaskProps[]) {
  const completedTasks = tasks.filter((task) => {
    if (task.hasCompleted) {
      return task
    }

    if (task.subtasks?.length !== 0) {
      const doneSubtasks = task.subtasks?.map((subtask) => subtask.hasCompleted)

      if (doneSubtasks?.every((value) => value)) {
        return task
      }
    }
  })

  return completedTasks
}