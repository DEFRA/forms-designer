import { Component } from 'react'

import { LinkEdit } from '~/src/LinkEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { type Edge } from '~/src/components/Visualisation/getLayout.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  allowEdit: boolean
  edges: Edge[]
}

interface State {
  edge?: Edge
}

export class Lines extends Component<Props, State> {
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
    const { allowEdit, edges } = this.props

    return (
      <>
        <svg className="line">
          {edges.map((edge) => {
            const { source, target, points, label } = edge

            const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ')

            const xs = edge.points.map((p) => p.x)
            const ys = edge.points.map((p) => p.y)

            const xMax = Math.max(...xs)
            const xMin = Math.min(...xs)
            const yMax = Math.max(...ys)
            const yMin = Math.min(...ys)

            // Preserve 100px × 30px safe space for condition
            const textWidth = Math.max(xMax - xMin, 100)
            const textHeight = Math.max(yMax - yMin, 30)

            const textX = xs.reduce((a, b) => a + b, 0) / xs.length
            const textY = ys.reduce((a, b) => a + b, 0) / ys.length

            const translateX = Math.round(textX - textWidth / 2)
            const translateY = Math.round(textY - textHeight / 2)

            return (
              <g key={pointsString}>
                <polyline
                  className={allowEdit ? 'editable' : undefined}
                  onClick={allowEdit ? () => this.editLink(edge) : undefined}
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
                  {allowEdit && (
                    <title>
                      {`Edit link from ${source} to ${target}`.replace(
                        /\//g,
                        ''
                      )}
                    </title>
                  )}
                </polyline>
                {label && (
                  <foreignObject
                    width={textWidth}
                    height={textHeight}
                    style={{
                      overflow: 'visible',
                      pointerEvents: 'none',
                      textAlign: 'center'
                    }}
                    transform={`translate(${translateX}, ${translateY})`}
                  >
                    <div className="line__condition">
                      <strong className="govuk-tag govuk-tag--green">
                        {label}
                      </strong>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
        {this.state.edge && (
          <RenderInPortal>
            <Flyout
              id="link-edit"
              title={i18n('link.edit')}
              onHide={() => this.setState({ edge: undefined })}
            >
              <LinkEdit
                edge={this.state.edge}
                onSave={() => this.setState({ edge: undefined })}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
