import { api } from "@/services/api"
import { TaskProps } from "@/types"
import { QueryKey, useQuery } from "@tanstack/react-query"

async function getTasks({ queryKey }: { queryKey: QueryKey }) {
  const [_key, { titleOrder = 'asc', dateOrder = 'asc' }] = queryKey as any

  try {
    const response = await api.get('/tasks', { params: { titleOrder, dateOrder } })

    const data = await response.data
    return data as TaskProps[]
  } catch (err) {
    console.error(err)
    return err
  }
}

export type UseTasksParams = Partial<{ titleOrder: 'asc' | 'desc', dateOrder: 'asc' | 'desc' }>

export function useTasks({ titleOrder, dateOrder }: UseTasksParams) {
  const { isFetching, data, refetch } = useQuery(
    { queryKey: ['tasks', { titleOrder, dateOrder }], queryFn: getTasks },
  )

  return { loading: isFetching, data, refetch }
}