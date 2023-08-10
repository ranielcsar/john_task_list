import axios from "axios"

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.request.use(async (config) => {
  const token = await fetch('http://localhost:3000/api/token').then((res) => res.json())

  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})