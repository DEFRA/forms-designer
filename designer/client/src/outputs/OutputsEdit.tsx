import React, { Component, type MouseEvent } from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { OutputEdit } from '~/src/outputs/OutputEdit.jsx'
import { type Output } from '~/src/outputs/types.js'
import randomId from '~/src/randomId.js'

interface Props {}

interface State {
  showAddOutput: boolean
  output?: any // TODO: type
  id?: string
}

export class OutputsEdit extends Component<Props, State> {
  static contextType = DataContext
  constructor(props) {
    super(props)
    this.state = {
      showAddOutput: false,
      output: undefined,
      id: ''
    }
  }

  onClickOutput = (event: MouseEvent, output) => {
    event.preventDefault()

    this.setState({
      output
    })
  }

  onClickAddOutput = async (event: MouseEvent) => {
    event.preventDefault()

    const id = randomId()
    this.setState({
      showAddOutput: true,
      id
    })
  }

  render() {
    const data = this.context.data
    const { outputs } = data
    const { output, id, showAddOutput } = this.state

    return (
      <>
        {!output ? (
          <>
            {showAddOutput ? (
              <OutputEdit
                data={data}
                output={{ name: id } as Output}
                onEdit={() => this.setState({ showAddOutput: false })}
                onCancel={() => this.setState({ showAddOutput: false })}
              />
            ) : (
              <>
                <ul className="govuk-list govuk-list--bullet">
                  {(outputs || []).map((output) => (
                    <li key={output.name}>
                      <a
                        className="govuk-link"
                        href="#"
                        onClick={(e) => this.onClickOutput(e, output)}
                      >
                        {output.title || output.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
                <div className="govuk-button-group">
                  <button
                    className="govuk-button"
                    data-testid="add-output"
                    type="button"
                    onClick={this.onClickAddOutput}
                  >
                    Add output
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <OutputEdit
            output={output}
            data={data}
            onEdit={() => this.setState({ output: null })}
            onCancel={() => this.setState({ output: null })}
          />
        )}
      </>
    )
  }
}
