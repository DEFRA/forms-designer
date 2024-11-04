// @ts-expect-error -- No types available
import { Textarea } from '@xgovformbuilder/govuk-react-jsx'
import {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent
} from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'

interface Props {
  onSave: () => void
}

interface State {
  declaration?: string
}

export class DeclarationEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {}

  componentDidMount() {
    const { data } = this.context

    this.setState({
      declaration: data.declaration
    })
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { onSave } = this.props
    const { save, data } = this.context
    const { declaration } = this.state

    const definition = structuredClone(data)
    definition.declaration = declaration

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'DeclarationEdit')
    }
  }

  onChangeDeclaration = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value: declaration } = e.target

    this.setState({
      declaration: declaration || undefined
    })
  }

  render() {
    const { declaration } = this.state

    return (
      <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
        <Textarea
          id="field-declaration"
          name="declaration"
          rows={3}
          label={{
            className: 'govuk-label--s',
            children: 'Declaration'
          }}
          hint={{
            children: (
              <>
                The declaration can include HTML and the `govuk-prose-scope` css
                class is available. Use this on a wrapping element to apply
                default govuk styles.
              </>
            )
          }}
          value={declaration}
          onChange={this.onChangeDeclaration}
        />

        <button className="govuk-button" type="submit">
          Save
        </button>
      </form>
    )
  }
}
