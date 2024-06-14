import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject
} from 'react'

import { Page } from '~/src/components/Page/Page.jsx'
import { Lines } from '~/src/components/Visualisation/Lines.jsx'
import {
  getLayout,
  type Pos
} from '~/src/components/Visualisation/getLayout.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  slug: string
  previewUrl: string
}

export function useVisualisation(ref: RefObject<HTMLDivElement>) {
  const { data } = useContext(DataContext)
  const [layout, setLayout] = useState<Pos>()

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const layout = getLayout(data, ref.current)
    setLayout(layout.pos)
  }, [data, ref])

  return { layout }
}

export function Visualisation(props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { layout } = useVisualisation(ref)
  const { data } = useContext(DataContext)

  const { previewUrl, slug } = props
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
                slug={slug}
              />
            ))}

            {layout && <Lines layout={layout} />}
          </div>
        </div>
      </div>
    </>
  )
}
