import React, { type HTMLAttributes, type FunctionComponent } from 'react'

export const DataPrettyPrint: FunctionComponent<
  HTMLAttributes<HTMLPreElement>
> = ({ children, ...attr }) => {
  return (
    <pre {...attr}>
      <code>{JSON.stringify(children, undefined, 2)}</code>
    </pre>
  )
}
