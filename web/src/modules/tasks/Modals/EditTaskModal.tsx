'use client'

import { FormEvent, useEffect, useState } from 'react'

import { PlusIcon } from '@/assets/icons/plusIcon'
import { TrashIcon } from '@/assets/icons/trashIcon'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { Modal } from '@/components/Modal'
import { TextInput } from '@/components/TextInput'
import { useToast } from '@/hooks/useToast'
import { api } from '@/services/api'
import { SubtaskProps, TaskProps } from '@/types'

import styles from '../scrollbar.module.css'


type EditTaskModalProps = {
  isOpen: boolean
  onClose(): void
  task: TaskProps | null
  refetchTasks(): void
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  refetchTasks,
}: EditTaskModalProps) {
  const [subtasks, setSubtasks] = useState<SubtaskProps[]>()
  const [titleValue, setTitleValue] = useState(task?.title)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setSubtasks(task.subtasks)
      setTitleValue(task.title)
    }
  }, [task])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    try {
      const form = new FormData(evt.currentTarget as HTMLFormElement)
      const title = form.get('title')
      const allSubtasksValue = form.getAll('subtask')

      const newSubtasks = subtasks?.map((subtask, index) => {
        return {
          ...subtask,
          title: allSubtasksValue[index],
        }
      })

      const newTask = {
        ...task,
        title,
        subtasks: newSubtasks,
      }
      const response = await api.put(`/tasks/${task?.id}`, newTask)
      if (response.data) {
        reset()
        refetchTasks()
        toast('Task updated', { type: 'success' })
      }
    } catch (error: any) {
      console.error(error.message)
      const parsedError = JSON.parse(error.response.data.message)[0]
      toast(parsedError.message, { type: 'error' })
    }
  }

  const handleNewSubtask = () => {
    setSubtasks((subtasks) => {
      if (subtasks) {
        return [...subtasks, { hasCompleted: false, title: '' }] as SubtaskProps[]
      }
    })
  }

  const handleHasCompletedSubtask = async (subtaskToComplete: SubtaskProps) => {
    try {
      const newSubtasks = subtasks?.map((subtask) => {
        if (subtask.id === subtaskToComplete?.id) {
          return {
            ...subtask,
            hasCompleted: !subtask.hasCompleted,
          }
        }

        return subtask
      })

      setSubtasks(newSubtasks)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSubtask = async (subtaskToDelete: SubtaskProps) => {
    try {
      const newSubtasks = subtasks?.filter((subtask) => {
        if (subtask.id !== subtaskToDelete?.id) {
          return subtask
        }
      })

      setSubtasks(newSubtasks)
    } catch (error) {
      console.error(error)
    }
  }

  const reset = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={reset}>
      <Modal.Title>Edit Task</Modal.Title>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="py-4">
          <TextInput
            name="title"
            label="Title"
            value={titleValue}
            onChange={(evt) => setTitleValue(evt.target.value)}
          />

          <section className="mb-2 mt-6">
            <header className="flex items-center justify-between gap-2">
              <p>
                Subtasks{' '}
                <span className="text-neutral-400">
                  {subtasks?.length !== 0 ? `(${subtasks?.length})` : null}
                </span>
              </p>
              <Button
                type="button"
                onClick={handleNewSubtask}
                className="group rounded-full border-2 border-dashed border-black bg-neutral-50 p-0 transition-colors hover:bg-lime-500 hover:text-black"
              >
                <span className="h-5 w-5 text-lime-500 group-hover:text-black">
                  <PlusIcon />
                </span>
              </Button>
            </header>

            <div
              className={`mt-4 grid max-h-[15rem] auto-rows-[3rem] gap-2 overflow-y-auto ${styles.custom_scroll}`}
            >
              {subtasks?.length === 0 ? (
                <p className="my-3 text-center text-sm text-neutral-400">No Subtasks</p>
              ) : (
                subtasks?.map((subtask) => (
                  <div key={subtask.title} className="flex w-full items-center gap-2">
                    <Checkbox
                      defaultChecked={subtask.hasCompleted}
                      onClick={() => handleHasCompletedSubtask(subtask)}
                    />
                    <TaskInput key={subtask.title} value={subtask.title} />
                    <button
                      type="button"
                      className="h-5 w-5 text-red-500"
                      onClick={() => handleDeleteSubtask(subtask)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" className="w-full rounded-full text-white">
            Save task
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

function TaskInput({ value }: { value: string }) {
  const [taskValue, setTaskValue] = useState(value)

  return (
    <TextInput
      placeholder="Subtask title..."
      name={'subtask'}
      className="w-[61vw] md:w-[18.1rem]"
      value={taskValue}
      onChange={(evt) => setTaskValue(evt.target.value)}
    />
  )
}
