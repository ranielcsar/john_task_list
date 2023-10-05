'use client'

import { FormEvent, useState } from 'react'

import { PlusIcon } from '@/assets/icons/plusIcon'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { TextInput } from '@/components/TextInput'
import { useToast } from '@/hooks/useToast'
import { api } from '@/services/api'
import { SubtaskProps } from '@/types'

import styles from '../scrollbar.module.css'

export function NewTaskModal({ refetchTasks }: { refetchTasks: () => void }) {
  const [openModal, setOpenModal] = useState(false)
  const [subtasks, setSubtasks] = useState([] as Omit<SubtaskProps, 'id'>[])
  const { toast } = useToast()

  const handleNewSubtask = () => {
    setSubtasks((subtasks) => [...subtasks, { hasCompleted: false, title: '' }])
  }

  const reset = () => {
    setOpenModal(false)
    setSubtasks([])
  }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    try {
      const form = new FormData(evt.currentTarget as HTMLFormElement)
      const title = form.get('title') as string
      const allSubtasksValue = form.getAll('subtask')
      const newSubtasks = subtasks.map((subtask, index) => {
        return {
          ...subtask,
          title: allSubtasksValue[index],
        }
      })

      const newTask = {
        hasCompleted: false,
        title,
        subtasks: newSubtasks,
      }
      const response = await api.post('/tasks', newTask)

      if (response) {
        reset()
        refetchTasks()
        toast('Task created', { type: 'success' })
      }
    } catch (error: any) {
      console.error(error)
      const parsedError = JSON.parse(error.response.data.message)[0]
      toast(parsedError.message, { type: 'error' })
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="group absolute right-10 top-[7.2rem] rounded-full border-2 border-dashed border-black bg-neutral-50 p-0 transition-colors hover:bg-lime-500 hover:text-black"
      >
        <span className="h-8 w-8 text-lime-500 group-hover:text-black">
          <PlusIcon />
        </span>
      </Button>

      <Modal isOpen={openModal} onClose={reset}>
        <Modal.Title>New Task</Modal.Title>

        <form onSubmit={handleSubmit}>
          <Modal.Body className="py-4">
            <TextInput name="title" label="Title" />

            <section className="mb-2 mt-6">
              <header className="flex items-center justify-between gap-2">
                <p>
                  Subtasks{' '}
                  <span className="text-neutral-400">
                    {subtasks.length !== 0 ? `(${subtasks.length})` : null}
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
                className={`mt-4 grid max-h-[20rem] auto-rows-[3rem] gap-2 overflow-y-auto ${styles.custom_scroll}`}
              >
                {subtasks.length === 0 ? (
                  <p className="my-3 text-center text-sm text-neutral-400">No Subtasks</p>
                ) : (
                  subtasks.map((subtask) => <TaskInput key={subtask.title} />)
                )}
              </div>
            </section>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" className="w-full rounded-full text-white">
              Add new task
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

function TaskInput() {
  const [value, setValue] = useState('')

  return (
    <TextInput
      placeholder="Subtask title..."
      name={'subtask'}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
    />
  )
}
