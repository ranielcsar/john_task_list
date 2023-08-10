'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, PropsWithChildren, ReactNode } from 'react'
import { ClassNameValue, twMerge } from 'tailwind-merge'

type DropdownProps = PropsWithChildren<{
  trigger: ReactNode
  menuItemsClass?: ClassNameValue
}>

export function Dropdown({ children, trigger, menuItemsClass }: DropdownProps) {
  return (
    <Menu as="div" className="w-auto">
      <div>
        <Menu.Button className="inline-flex h-max w-full justify-center text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {trigger}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={twMerge(
            'absolute right-5 z-20 w-auto origin-top-right divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            menuItemsClass,
          )}
        >
          <div className="flex flex-col items-start justify-between gap-2 p-2">
            {children}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export function DropdownItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Menu.Item as="div" className={className}>
      {children}
    </Menu.Item>
  )
}
