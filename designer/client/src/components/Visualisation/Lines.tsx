import React, { Component, type ContextType } from 'react'

import { LinkEdit } from '~/src/LinkEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import {
  type Edge,
  type Pos
} from '~/src/components/Visualisation/getLayout.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  layout: Pos
}

interface State {
  edge?: Edge
}

export class Lines extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state: State = {}

  editLink = (edge: Edge) => {
    this.setState({ edge })
  }

  handleEnterOrSpace = (key: string, handler: () => void) => {
    if (key === 'Enter' || key === ' ') {
      handler()
    }
  }

  render() {
    const { layout } = this.props

    return (
      <>
        <svg height={layout.height} width={layout.width}>
          {layout.edges.map((edge) => {
            const { source, target, points, label } = edge
            const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ')

            const xs = edge.points.map((p) => p.x)
            const ys = edge.points.map((p) => p.y)

            const textX = xs.reduce((a, b) => a + b, 0) / xs.length
            const textY = ys.reduce((a, b) => a + b, 0) / ys.length - 5

            return (
              <g key={pointsString}>
                <polyline
                  onClick={() => this.editLink(edge)}
                  onKeyDown={(event) =>
                    this.handleEnterOrSpace(event.key, () =>
                      this.editLink(edge)
                    )
                  }
                  tabIndex={0}
                  points={pointsString}
                  data-testid={`${source}-${target}`.replace(/\//g, '')}
                  role="button"
                >
                  <title>
                    {`Edit link from ${source} to ${target}`.replace(/\//g, '')}
                  </title>
                </polyline>
                {label && (
                  <text
                    textAnchor="middle"
                    x={textX}
                    y={textY}
                    fill="black"
                    pointerEvents="none"
                  >
                    {label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        {this.state.edge && (
          <Flyout
            title="Edit Link"
            onHide={() => this.setState({ edge: undefined })}
          >
            <LinkEdit
              edge={this.state.edge}
              onEdit={() => this.setState({ edge: undefined })}
            />
          </Flyout>
        )}
      </>
    )
  }
}
