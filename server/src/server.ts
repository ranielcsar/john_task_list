import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastify from 'fastify'
import 'dotenv/config'

import { taskRoutes } from './routes'

export const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'john_tasks',
})

app.get('/token', async () => {
  const token = app.jwt.sign(
    {
      name: 'john',
    },
    {
      sub: '123',
      expiresIn: '30 days',
    },
  )

  return {
    token,
  }
})

app.get('/', () => {
  return { isOnline: true }
})
app.register(taskRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server listening on http://localhost:3333'))
