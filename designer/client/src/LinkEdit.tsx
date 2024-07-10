import { type Link, type Page } from '@defra/forms-model'
import React, {
  Component,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { type Edge } from '~/src/components/Visualisation/getLayout.js'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLink } from '~/src/data/page/updateLink.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  edge: Edge
  onEdit: () => void
}

interface State {
  page: Page
  link: Link
  selectedCondition?: string
}

export class LinkEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    const { edge } = this.props
    const { data } = this.context

    const [page] = findPage(data, edge.source)
    const link = page.next?.find((n) => n.path === edge.target)

    if (!link) {
      throw new Error(
        `Link not found from '${edge.source}' to '${edge.target}'`
      )
    }

    this.state = {
      page,
      link,
      selectedCondition: link.condition
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { link, page, selectedCondition } = this.state
    const { data, save } = this.context

    const updatedData = updateLink(
      data,
      page.path,
      link.path,
      selectedCondition
    )

    try {
      await save(updatedData)
      this.props.onEdit()
    } catch (error) {
      logger.error(error, 'LinkEdit')
    }
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { link, page } = this.state
    const { data, save } = this.context

    const updatedData = deleteLink(data, page.path, link.path)

    try {
      await save(updatedData)
      this.props.onEdit()
    } catch (error) {
      logger.error(error, 'LinkEdit')
    }
  }

  render() {
    const { edge } = this.props
    const { data } = this.context
    const { selectedCondition } = this.state
    const { pages } = data

    return (
      <form onSubmit={this.onSubmit} autoComplete="off">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-source">
            From
          </label>
          <select
            value={edge.source}
            className="govuk-select"
            id="link-source"
            name="link-source"
            disabled
          >
            <option value="" />
            {pages.map((page) => (
              <option key={page.path} value={page.path}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-target">
            To
          </label>
          <select
            value={edge.target}
            className="govuk-select"
            id="link-target"
            name="link-target"
            disabled
          >
            <option value="" />
            {pages.map((page) => (
              <option key={page.path} value={page.path}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <SelectConditions
          path={edge.source}
          selectedCondition={selectedCondition}
          conditionsChange={this.conditionSelected}
          noFieldsHintText={i18n('addLink.noFieldsAvailable')}
        />
        <div className="govuk-button-group">
          <button className="govuk-button" type="submit">
            Save
          </button>
          <button
            className="govuk-button govuk-button--warning"
            type="button"
            onClick={this.onClickDelete}
          >
            Delete
          </button>
        </div>
      </form>
    )
  }

  conditionSelected = (selectedCondition: string) => {
    this.setState({
      selectedCondition
    })
  }
}
