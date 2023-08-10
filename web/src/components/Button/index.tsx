import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Button({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        'flex w-max items-center justify-center bg-lime-500 px-6 py-3 text-[1rem] transition-colors hover:bg-lime-600',
        className,
      )}
      {...rest}
    />
  )
}
