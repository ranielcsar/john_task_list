'use client'

import { authStore } from '@/services/auth'
import { useEffect } from 'react'

export function TokenOnAuth({ token }: { token: string }) {
  const { setToken } = authStore()

  useEffect(() => {
    if (token) {
      setToken(token)
    }
  }, [token])

  return <></>
}
