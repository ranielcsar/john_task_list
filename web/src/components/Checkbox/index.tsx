import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Checkbox({
  className,
  ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, any>) {
  return (
    <label className="relative" htmlFor={props.name}>
      <input
        type="checkbox"
        className={twMerge(
          `peer mt-1 h-6 w-6 shrink-0 ${
            props.readOnly ? 'cursor-default' : 'cursor-pointer'
          } appearance-none rounded-full border-2 border-black bg-white checked:border-0 checked:bg-lime-500`,
          className,
        )}
        {...props}
      />
      <svg
        className={`absolute left-1 top-2 hidden h-4 w-4 text-white peer-checked:block ${
          props.readOnly ? 'cursor-default' : 'cursor-pointer'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </label>
  )
}
