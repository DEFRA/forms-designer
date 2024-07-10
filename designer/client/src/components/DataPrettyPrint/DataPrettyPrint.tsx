import React, { type HTMLAttributes, type FunctionComponent } from 'react'

export const DataPrettyPrint: FunctionComponent<
  HTMLAttributes<HTMLPreElement>
> = ({ children, ...attr }) => {
  return (
    <pre tabIndex={-1} {...attr}>
      <code tabIndex={0}>{JSON.stringify(children, undefined, 2)}</code>
    </pre>
  )
}
