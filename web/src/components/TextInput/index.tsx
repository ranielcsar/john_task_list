import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { twMerge } from 'tailwind-merge'

export function TextInput({
  className,
  label,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, any> & { label?: string }) {
  return (
    <label htmlFor={props.name} className="flex flex-col gap-1">
      {label}
      <input
        id={props.name}
        type="text"
        className={twMerge('rounded-md border border-neutral-300 p-2', className)}
        {...props}
      />
    </label>
  )
}
