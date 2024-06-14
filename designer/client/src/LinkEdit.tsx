import React, { Component, type ContextType } from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLink } from '~/src/data/page/updateLink.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export class LinkEdit extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context: typeof DataContext) {
    super(props, context)

    const { edge } = this.props
    const { data } = this.context

    const [page] = findPage(data, edge.source)
    const link = page.next.find((n) => n.path === edge.target)

    this.state = {
      page,
      link,
      selectedCondition: link.condition
    }
  }

  onSubmit = async (e) => {
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

  onClickDelete = (e) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { link, page } = this.state
    const { data, save } = this.context

    const copy = { ...data }
    const [copyPage] = findPage(data, page.path)
    const copyLinkIdx = copyPage.next.findIndex((n) => n.path === link.path)
    copyPage.next.splice(copyLinkIdx, 1)
    copy.pages = copy.pages.map((page) =>
      page.path === copyPage.path ? copyPage : page
    )

    save(copy)
      .then((data) => {
        this.props.onEdit({ data })
      })
      .catch((error: unknown) => {
        logger.error(error, 'LinkEdit')
      })
  }

  render() {
    const { edge } = this.props
    const { data } = this.context
    const { selectedCondition } = this.state
    const { pages } = data

    return (
      <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
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
            <option />
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
            <option />
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

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition
    })
  }
}
