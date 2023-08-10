import { toast as reactToast, ToastOptions } from 'react-toastify'

export function useToast() {
  const toast = (message: string, options?: ToastOptions) =>
    reactToast(message, {
      ...options,
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      theme: 'light',
    })

  return { toast }
}
