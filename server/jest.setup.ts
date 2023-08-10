import { app } from '@/server'

afterAll(() => app.close())
