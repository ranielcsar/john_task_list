'use client'

import { useEffect } from 'react'

import { authStore } from '@/services/auth'

export function TokenOnAuth({ token }: { token: string }) {
  const { setToken } = authStore()

  useEffect(() => {
    if (token) {
      setToken(token)
    }
  }, [token])

  return <></>
}
