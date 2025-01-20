import { ConditionsModel, type Page } from '@defra/forms-model'
import { Component, type ContextType } from 'react'

import { SortUpDown } from '~/src/SortUpDown.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { findCondition } from '~/src/data/condition/findCondition.js'
import { arrayMove } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  onSave: () => void
}

interface State {
  pages: Page[]
}

export class PagesEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {
    pages: []
  }

  componentDidMount() {
    const { data } = this.context

    const pages = structuredClone(data.pages)

    this.setState({ pages })
  }

  onClickSave = async () => {
    const { onSave } = this.props
    const { data, save } = this.context
    const { pages } = this.state

    // Save the definition with the new ordered pages
    const definition = structuredClone(data)
    definition.pages = pages

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PagesEdit')
    }
  }

  render() {
    const { pages } = this.state
    const { data } = this.context

    const moveUpTitle = i18n('pages.moveUp')
    const moveDownTitle = i18n('pages.moveDown')

    const handleMove = (index: number, newIndex: number) => {
      this.setState({ pages: arrayMove(pages, index, newIndex) })
    }

    return (
      <>
        <ul className="app-results app-results--panel">
          {pages.map((page, index) => {
            const key = page.path
            const moveUpLabel = i18n('pages.moveUp_label', {
              title: page.title
            })
            const moveDownLabel = i18n('pages.moveDown_label', {
              title: page.title
            })
            const condition = page.condition
              ? findCondition(data, page.condition)
              : undefined

            return (
              <li key={key} className="app-result">
                <div className="app-result__container govuk-body">
                  <span>{page.title}</span>
                  <p className="govuk-!-margin-top-1 govuk-!-margin-bottom-0 govuk-body-s">
                    {page.path}
                  </p>
                  {condition && (
                    <p className="govuk-!-margin-top-1 govuk-!-margin-bottom-0 govuk-body-s">
                      <span className="govuk-!-font-weight-bold">IF: </span>
                      {ConditionsModel.from(
                        condition.value
                      ).toPresentationString()}
                    </p>
                  )}
                </div>
                <SortUpDown
                  moveUp={{
                    title: moveUpTitle,
                    children: moveUpLabel,
                    onClick: () => handleMove(index, index - 1)
                  }}
                  moveDown={{
                    title: moveDownTitle,
                    children: moveDownLabel,
                    onClick: () => handleMove(index, index + 1)
                  }}
                />
              </li>
            )
          })}
        </ul>
        <button
          className="govuk-button"
          type="button"
          onClick={this.onClickSave}
        >
          Save
        </button>
      </>
    )
  }
}
