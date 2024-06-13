import { type FormDefinition } from '@defra/forms-model'
import React, { Component, type KeyboardEvent } from 'react'

import { LinkEdit } from '~/src/LinkEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import {
  type Layout,
  type Edge
} from '~/src/components/Visualisation/getLayout.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  layout: Layout['pos']
  data: FormDefinition
}

interface State {
  showEditor: Edge | boolean
}

export class Lines extends Component<Props, State> {
  static contextType = DataContext

  state = {
    showEditor: false
  }

  editLink = (edge: Edge) => {
    this.setState({
      showEditor: edge
    })
  }

  handlePolylineKeyPress = (event: KeyboardEvent, edge: Edge) => {
    if (event.key === 'Enter' || event.key == ' ') {
      this.editLink(edge)
    }
  }

  render() {
    const { layout } = this.props
    const { data } = this.context

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
                  onKeyPress={(event) =>
                    this.handlePolylineKeyPress(event, edge)
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
        {this.state.showEditor && (
          <Flyout
            title="Edit Link"
            onHide={() => this.setState({ showEditor: false })}
          >
            <LinkEdit
              edge={this.state.showEditor}
              data={data}
              onEdit={() => this.setState({ showEditor: false })}
            />
          </Flyout>
        )}
      </>
    )
  }
}
