import { type ComponentProps } from 'react'

interface Props extends Omit<ComponentProps<'pre'>, 'children'> {
  children: object
}

export function DataPrettyPrint({ children, ...attributes }: Readonly<Props>) {
  return (
    <pre {...attributes}>
      <code>{JSON.stringify(children, undefined, 2)}</code>
    </pre>
  )
}
