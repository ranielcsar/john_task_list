import { NewTaskModal } from './Modals'
import { OrderTasks } from './OrderTasks'
import { TaskList } from './TaskList'

export async function Tasks() {
  return (
    <main className="m-auto h-full w-full max-w-screen-xl px-5 py-10">
      <h1 className="text-xl lg:text-2xl">John Task List</h1>

      <header className="my-10 flex items-center justify-between">
        <div className="flex w-[75%] items-center gap-5 overflow-x-auto">
          <OrderTasks />
        </div>

        <NewTaskModal />
      </header>

      <TaskList />
    </main>
  )
}
