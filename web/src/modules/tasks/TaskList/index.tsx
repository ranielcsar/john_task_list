'use client'
import { useEffect, useState } from 'react'

import { Disclosure, Transition } from '@headlessui/react'
import dayjs from 'dayjs'

import {
  CheckIcon,
  ChevronUpIcon,
  PencilIcon,
  SortIcon,
  ThreeDotIcon,
  TrashIcon,
} from '@/assets/icons'
import { Checkbox, Dropdown, DropdownItem } from '@/components'
import { useToast } from '@/hooks/useToast'
import { api } from '@/services/api'
import { TaskProps } from '@/types'

import { DeleteTaskModal, EditTaskModal, NewTaskModal } from '../Modals'
import styles from '../scrollbar.module.css'
import { useTasksStore } from '../store'

import { useHandleTasks } from './hooks/useHandleTasks'
import { useTasks, UseTasksParams } from './hooks/useTasks'
import { handleCompletedTasks } from './utils/handleCompletedTasks'
import { handleInProgressTasks } from './utils/handleInProgressTasks'

export function TaskList() {
  const [orders, setOrders] = useState<UseTasksParams>({
    dateOrder: 'asc',
    titleOrder: 'asc',
  })
  const { loading, data: tasks, refetch: refetchTasks } = useTasks(orders)
  const [filteredTasks, setFilteredTasks] = useState([] as TaskProps[])
  const selectedFilter = useTasksStore((state) => state.selectedFilter)
  const { taskToEdit, setTaskToEdit, taskToDelete, setTaskToDelete } = useHandleTasks()
  const { toast } = useToast()

  useEffect(() => {
    setFilteredTasks(tasks as TaskProps[])
  }, [tasks])

  useEffect(() => {
    if (selectedFilter) {
      switch (selectedFilter) {
        case 'All tasks':
          return setFilteredTasks(tasks as TaskProps[])
        case 'In progress':
          const inProgressTasks = handleInProgressTasks(tasks as TaskProps[])
          return setFilteredTasks(inProgressTasks)
        case 'Completed':
          const completedTasks = handleCompletedTasks(tasks as TaskProps[])
          return setFilteredTasks(completedTasks)
        default:
          return
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter])

  const handleHasCompletedTask = async (task: TaskProps) => {
    try {
      const haveIncompletedSubtask = task.subtasks.some(
        (subtask) => subtask.hasCompleted === false,
      )

      if (haveIncompletedSubtask)
        return toast('You have incomplete subtasks', { type: 'error' })

      const newTasks = filteredTasks?.map((f_task) => {
        if (f_task.id === task.id) {
          return {
            ...task,
            hasCompleted: !task.hasCompleted,
          }
        }

        return f_task
      })

      await api.put(`/tasks/${task.id}`, {
        ...task,
        hasCompleted: !task.hasCompleted,
      })
      refetchTasks()
      setFilteredTasks(newTasks)
    } catch (error: any) {
      console.error(error)
      const parsedError = JSON.parse(error.response.data.message)[0]
      toast(parsedError.message, { type: 'error' })
    }
  }

  if (loading) {
    return Array.from({ length: 3 }, (_, i: number) => i).map((value) => (
      <div
        key={value}
        role="status"
        className="mb-6 h-[5rem] w-full animate-pulse rounded-sm bg-neutral-200"
      />
    ))
  }

  return (
    <>
      <section className="relative">
        <SortMenu setOrders={setOrders} />

        <div
          className={`max-h-[70vh] overflow-y-auto ${styles.custom_scroll} flex flex-col`}
        >
          {filteredTasks?.length === 0 ? (
            <h3 className="mt-6 text-center text-xl">No Tasks</h3>
          ) : (
            filteredTasks?.map((task) => (
              <Task
                key={task.title}
                task={task}
                handleHasCompletedTask={handleHasCompletedTask}
              />
            ))
          )}
        </div>

        <EditTaskModal
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          task={taskToEdit}
          refetchTasks={refetchTasks}
        />

        <DeleteTaskModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          task={taskToDelete}
          refetchTasks={refetchTasks}
        />
      </section>

      <NewTaskModal refetchTasks={refetchTasks} />
    </>
  )
}

function Task({
  task,
  handleHasCompletedTask,
}: {
  task: TaskProps
  handleHasCompletedTask(task: TaskProps): void
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <section
            key={task.id}
            className="relative mb-5 flex min-h-[7rem] gap-2 md:gap-4 lg:w-[98%]"
          >
            <Checkbox
              checked={task.hasCompleted}
              onChange={() => handleHasCompletedTask(task)}
            />

            <TaskMenuMobile task={task} />

            <div className="relative w-[95%] rounded-md border border-neutral-200 p-2 shadow-sm">
              <div className="flex flex-col items-start justify-between">
                <p className="line-clamp-2 w-44 lg:w-auto">{task.title}</p>

                <p className="mt-1 text-neutral-400">
                  ({task.subtasks?.length} subtasks)
                </p>
              </div>

              <p className="absolute bottom-2 right-3 text-sm">
                {dayjs(task.createdAt).format('D MMMM[, ]YYYY')}
              </p>
            </div>
            <TaskMenu task={task} />
          </section>

          <Disclosure.Button className="relative" title="Show subtasks">
            <div
              className={`absolute bottom-7 left-12 h-5 w-5 transition-transform md:inset-x-1/2 ${
                open ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <ChevronUpIcon />
            </div>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-80 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="mb-5 ml-10 flex h-max flex-col gap-2 rounded-md bg-gray-200 p-4 md:ml-14 md:w-[85%] lg:w-[90%]">
              {task?.subtasks?.length === 0 ? (
                <p className="my-3 text-center text-lg text-black">No Subtasks</p>
              ) : (
                task?.subtasks?.map((subtask) => (
                  <div key={subtask.title} className="flex w-full items-center gap-2">
                    <span
                      className={`h-5 w-5 text-black ${
                        subtask.hasCompleted ? 'block' : 'hidden'
                      }`}
                    >
                      <CheckIcon />
                    </span>
                    <p
                      className={`${
                        subtask.hasCompleted ? 'line-through' : 'decoration-transparent'
                      }`}
                    >
                      {subtask.title}
                    </p>
                  </div>
                ))
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

function TaskMenu({ task }: { task: TaskProps }) {
  const setTaskToEdit = useTasksStore((state) => state.setTaskToEdit)
  const setTaskToDelete = useTasksStore((state) => state.setTaskToDelete)

  return (
    <div className="hidden flex-col gap-5 lg:flex">
      <button title="Edit" onClick={() => setTaskToEdit(task)}>
        <div className="h-5 w-5 bg-transparent">
          <PencilIcon />
        </div>
      </button>

      <button title="Delete" onClick={() => setTaskToDelete(task)}>
        <div className="h-5 w-5 bg-transparent text-red-500">
          <TrashIcon />
        </div>
      </button>
    </div>
  )
}

function TaskMenuMobile({ task }: { task: TaskProps }) {
  const setTaskToEdit = useTasksStore((state) => state.setTaskToEdit)
  const setTaskToDelete = useTasksStore((state) => state.setTaskToDelete)

  return (
    <Dropdown
      trigger={
        <span className="absolute right-3 top-2 z-10 h-max w-5 bg-transparent lg:hidden">
          <ThreeDotIcon />
        </span>
      }
    >
      <DropdownItem className="flex items-center gap-2 px-1 py-2">
        <div className="h-5 w-5 bg-transparent">
          <PencilIcon />
        </div>
        <button onClick={() => setTaskToEdit(task)}>Edit</button>
      </DropdownItem>
      <DropdownItem className="flex items-center gap-2 px-1 py-2 text-red-500">
        <div className="h-5 w-5 bg-transparent">
          <TrashIcon />
        </div>
        <button onClick={() => setTaskToDelete(task)}>Delete</button>
      </DropdownItem>
    </Dropdown>
  )
}

function SortMenu({ setOrders }: { setOrders: any }) {
  const defaultOrders = {
    dateOrder: 'asc',
    titleOrder: 'asc',
  }

  return (
    <Dropdown
      menuItemsClass="-top-[7rem] lg:-top-10 lg:right-24"
      trigger={
        <button className="fixed right-5 top-10 h-8 w-8 lg:absolute lg:-top-[4.8rem] lg:right-20">
          <SortIcon />
        </button>
      }
    >
      <button
        onClick={() => setOrders(defaultOrders)}
        className="w-full px-1 py-2 text-start hover:bg-neutral-200"
      >
        <DropdownItem>Sort ASC (A-z)</DropdownItem>
      </button>
      <button
        onClick={() => setOrders({ ...defaultOrders, titleOrder: 'desc' })}
        className="w-full px-1 py-2 text-start hover:bg-neutral-200"
      >
        <DropdownItem>Sort Desc (Z-a)</DropdownItem>
      </button>
      <button
        onClick={() => setOrders(defaultOrders)}
        className="w-full px-1 py-2 text-start hover:bg-neutral-200"
      >
        <DropdownItem>Sort by date (ASC)</DropdownItem>
      </button>
      <button
        onClick={() => setOrders({ ...defaultOrders, dateOrder: 'desc' })}
        className="w-full px-1 py-2 text-start hover:bg-neutral-200"
      >
        <DropdownItem>Sort by date (DESC)</DropdownItem>
      </button>
    </Dropdown>
  )
}
