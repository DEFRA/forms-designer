import React, { type ComponentProps } from 'react'

interface Props extends Omit<ComponentProps<'pre'>, 'children'> {
  children: object
}

export function DataPrettyPrint({ children, ...attributes }: Readonly<Props>) {
  return (
    <pre tabIndex={-1} {...attributes}>
      <code tabIndex={0}>{JSON.stringify(children, undefined, 2)}</code>
    </pre>
  )
}
