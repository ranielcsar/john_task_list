import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const titleError = 'Title cannot be empty'
const subtaskTitleError = 'Subtask title cannot be empty'

function createTask(app: FastifyInstance) {
  app.post('/tasks', async (request) => {
    const subtaskSchema = z.object({
      title: z.string().nonempty({ message: subtaskTitleError }),
      hasCompleted: z.coerce.boolean().default(false),
    })
    const bodySchema = z.object({
      title: z.string().nonempty({ message: titleError }),
      subtasks: z.array(subtaskSchema),
      hasCompleted: z.coerce.boolean().default(false),
    })

    const { title, hasCompleted, subtasks } = bodySchema.parse(request.body)

    const task = await prisma.task.create({
      data: {
        title,
        hasCompleted,
        subtasks: {
          create: subtasks,
        },
      },
    })

    return task
  })
}

export function getTasks(app: FastifyInstance) {
  app.get('/tasks', async (request) => {
    const paramsSchema = z.object({
      titleOrder: z.enum(['asc', 'desc']),
      dateOrder: z.enum(['asc', 'desc']),
    })
    const { titleOrder, dateOrder } = paramsSchema.parse(request.query)

    const tasks = await prisma.task.findMany({
      orderBy: [
        {
          createdAt: dateOrder,
        },
        {
          title: titleOrder,
        },
      ],
      include: {
        subtasks: true,
      },
    })

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      hasCompleted: task.hasCompleted,
      subtasks: task.subtasks,
      createdAt: task.createdAt,
    }))
  })
}

function getSpecificTask(app: FastifyInstance) {
  app.get('/tasks/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const task = await prisma.task.findUniqueOrThrow({ where: { id } })

    return task
  })
}

function updateTask(app: FastifyInstance) {
  app.put('/tasks/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const subtaskSchema = z.object({
      id: z.string().optional(),
      title: z.string().nonempty({ message: subtaskTitleError }),
      hasCompleted: z.coerce.boolean().default(false),
    })
    const bodySchema = z.object({
      title: z.string().nonempty({ message: titleError }),
      subtasks: z.array(subtaskSchema),
      hasCompleted: z.coerce.boolean().default(false),
    })
    const { title, subtasks } = bodySchema.parse(request.body)

    const subtasksToUpdate = []
    const subtasksToCreate = []

    for (const subtask of subtasks) {
      if (subtask.id) {
        subtasksToUpdate.push({
          where: { id: subtask.id },
          data: {
            title: subtask.title,
            hasCompleted: subtask.hasCompleted,
          },
        })
      } else {
        subtasksToCreate.push({
          title: subtask.title,
          hasCompleted: subtask.hasCompleted,
        })
      }
    }

    const allSubtasks = await prisma.subtask.findMany({
      where: { taskId: id },
    })
    const subtasksToDelete = []

    for (const index in allSubtasks) {
      if (allSubtasks[index].id !== subtasks[index]?.id) {
        subtasksToDelete.push(allSubtasks[index])
      }
    }

    let newHasCompleted = false
    const allCompleted = subtasksToUpdate.every(
      (subtask) => subtask.data.hasCompleted === true,
    )

    if (subtasksToCreate.length === 0 || subtasksToDelete.length === 0) {
      if (allCompleted) {
        newHasCompleted = true
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        hasCompleted: newHasCompleted,
        subtasks: {
          update: subtasksToUpdate,
          create: subtasksToCreate,
          deleteMany: subtasksToDelete,
        },
      },
      include: { subtasks: true },
    })

    return task
  })
}

function deleteTask(app: FastifyInstance) {
  app.delete('/tasks/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    await prisma.subtask.deleteMany({
      where: { taskId: id },
    })

    const success = await prisma.task.delete({
      where: { id },
    })

    if (success) return success

    return false
  })
}

export async function taskRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  createTask(app)
  getTasks(app)
  getSpecificTask(app)
  updateTask(app)
  deleteTask(app)
}
