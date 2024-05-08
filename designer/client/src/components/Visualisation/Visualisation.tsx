import React, { useContext, useEffect, useRef, useState } from 'react'

import { Page } from '~/src/components/Page/index.js'
import { Lines } from '~/src/components/Visualisation/Lines.jsx'
import {
  getLayout,
  type Pos
} from '~/src/components/Visualisation/getLayout.js'
import { DataContext } from '~/src/context/index.js'
import '~/src/components/Visualisation/visualisation.scss'

interface Props {
  id: string
  slug: string
  previewUrl: string
  persona?: any
}

export function useVisualisation(ref) {
  const { data } = useContext(DataContext)
  const [layout, setLayout] = useState<Pos>()

  useEffect(() => {
    const layout = getLayout(data, ref.current)
    setLayout(layout.pos)
  }, [data, ref])

  return { layout }
}

export function Visualisation(props: Props) {
  const ref = useRef(null)
  const { layout } = useVisualisation(ref)
  const { data } = useContext(DataContext)

  const { previewUrl, persona, id } = props
  const { pages } = data

  const wrapperStyle = layout && {
    width: layout.width,
    height: layout.height
  }

  return (
    <>
      <div className="visualisation">
        <div className="visualisation__pages-wrapper">
          <div ref={ref} style={wrapperStyle}>
            {pages.map((page, index) => (
              <Page
                key={index}
                page={page}
                previewUrl={previewUrl}
                layout={layout?.nodes[index]}
                id={id}
              />
            ))}

            {layout && <Lines layout={layout} data={data} persona={persona} />}
          </div>
        </div>
      </div>
    </>
  )
}
