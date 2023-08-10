export type TaskProps = {
  id: string
  title: string
  hasCompleted: boolean
  subtasks: SubtaskProps[]
  createdAt?: Date | string
}

export type SubtaskProps = Omit<TaskProps, 'subtasks' | 'createdAt'>