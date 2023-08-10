import { FormEvent } from 'react'

import { TrashIcon } from '@/assets/icons/trashIcon'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { useToast } from '@/hooks/useToast'
import { api } from '@/services/api'
import { TaskProps } from '@/types'

type DeleteTaskModalProps = {
  isOpen: boolean
  onClose(): void
  task: TaskProps | null
  refetchTasks(): void
}

export function DeleteTaskModal({
  isOpen,
  onClose,
  task,
  refetchTasks,
}: DeleteTaskModalProps) {
  const { toast } = useToast()
  const reset = () => {
    onClose()
  }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    try {
      const response = await api.delete(`/tasks/${task?.id}`)
      if (response.statusText === 'OK') {
        reset()
        refetchTasks()
        toast('Task deleted', { type: 'success' })
      }
    } catch (error: any) {
      console.error(error)
      const parsedError = JSON.parse(error.response.data.message)[0]
      toast(parsedError.message, { type: 'error' })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={reset}>
      <Modal.Title>Delete Task</Modal.Title>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="py-6 text-center">
          Are you sure that you want do delete:
          <br /> <strong>{task?.title}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="submit"
            className="flex w-full items-center gap-2 rounded-full bg-red-500 text-white"
          >
            <span className="h-5 w-5">
              <TrashIcon />
            </span>
            Delete task
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
