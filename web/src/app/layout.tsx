import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ToastContainer } from 'react-toastify'

import { QueryProvider } from './QueryProvider'
import 'react-toastify/dist/ReactToastify.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--roboto',
})

export const metadata: Metadata = {
  title: 'John Task List',
  description: 'John Task List management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-screen bg-neutral-50 text-black ${roboto.className}`}>
        <QueryProvider>{children}</QueryProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
