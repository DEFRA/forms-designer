import { clone } from '@defra/forms-model'
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, { Component, createRef, type ContextType } from 'react'

import { type ErrorList, ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { toUrl } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { validateTitle, hasValidationErrors } from '~/src/validations.js'

export class PageEdit extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    const { page } = this.props

    this.state = {
      path: page?.path ?? this.generatePath(page.title),
      controller: page?.controller ?? '',
      title: page?.title ?? '',
      section: page?.section ?? '',
      isEditingSection: false,
      errors: {}
    }

    this.formEditSection = createRef()
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { save, data } = this.context
    const { title, path, section, controller } = this.state
    const { page } = this.props

    const validationErrors = this.validate(title, path)
    if (hasValidationErrors(validationErrors)) return

    let copy = { ...data }
    const [copyPage, copyIndex] = findPage(data, page.path)
    const pathChanged = path !== page.path

    if (pathChanged) {
      copy = updateLinksTo(data, page.path, path)
      copyPage.path = path
    }

    copyPage.title = title
    section ? (copyPage.section = section) : delete copyPage.section
    controller ? (copyPage.controller = controller) : delete copyPage.controller

    copy.pages[copyIndex] = copyPage

    try {
      await save(copy)
      this.props.onEdit()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  validate = (title, path): ErrorList => {
    const { page } = this.props
    const { data } = this.context

    const titleErrors = validateTitle(
      'title',
      'page-title',
      '$t(page.title)',
      title,
      i18n
    )

    const errors = { ...titleErrors }

    const pathHasErrors =
      path !== page.path ? data.pages.some((page) => page.path === path) : false

    if (pathHasErrors) {
      errors.path = {
        href: '#page-path',
        children: `Path '${path}' already exists`
      }
    }

    this.setState({ errors })

    return errors
  }

  onClickDelete = async (e) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { save, data } = this.context
    const { page } = this.props
    const copy = clone(data)

    const copyPageIdx = copy.pages.findIndex((p) => p.path === page.path)

    // Remove all links to the page
    copy.pages.forEach((p, index) => {
      if (index !== copyPageIdx && Array.isArray(p.next)) {
        for (let i = p.next.length - 1; i >= 0; i--) {
          const next = p.next[i]
          if (next.path === page.path) {
            p.next.splice(i, 1)
          }
        }
      }
    })

    copy.pages.splice(copyPageIdx, 1)

    try {
      await save(copy)
      this.props.onEdit()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  onChangeTitle = (e) => {
    const title = e.target.value
    this.setState({
      title,
      path: this.generatePath(title)
    })
  }

  onChangePath = (e) => {
    const input = e.target.value
    const path = input.startsWith('/') ? input : `/${input}`
    this.setState({
      path: path.replace(/\s/g, '-')
    })
  }

  generatePath(title) {
    let path = toUrl(title)
    const { data } = this.context
    const { page } = this.props
    if (data.pages.find((page) => page.path === path) && page.title !== title) {
      path = `${path}-${randomId()}`
    }
    return path
  }

  editSection = (e, newSection = false) => {
    e.preventDefault()
    this.setState({
      isEditingSection: true,
      isNewSection: newSection
    })
  }

  closeFlyout = (sectionName) => {
    const propSection = this.state.section ?? this.props.page?.section ?? ''
    this.setState({
      isEditingSection: false,
      section: sectionName
    })
  }

  onChangeSection = (e) => {
    this.setState({
      section: e.target.value
    })
  }

  findSectionWithName(name) {
    const { data } = this.context
    const { sections } = data
    return sections.find((section) => section.name === name)
  }

  render() {
    const { data } = this.context
    const { sections } = data
    const {
      title,
      path,
      controller,
      section,
      isEditingSection,
      isNewSection,
      errors
    } = this.state

    return (
      <div data-testid="page-edit">
        {hasValidationErrors(errors) && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="page-type">
              {i18n('page.type')}
            </label>
            <div className="govuk-hint">{i18n('page.typeHint')}</div>
            <select
              className="govuk-select"
              id="page-type"
              name="page-type"
              value={controller}
              onChange={(e) => this.setState({ controller: e.target.value })}
            >
              <option value="">{i18n('page.types.question')}</option>
              <option value="./pages/start.js">
                {i18n('page.types.start')}
              </option>
              <option value="./pages/summary.js">
                {i18n('page.types.summary')}
              </option>
            </select>
          </div>
          <Input
            id="page-title"
            name="title"
            label={{
              className: 'govuk-label--s',
              children: [i18n('page.title')]
            }}
            value={title}
            onChange={this.onChangeTitle}
            errorMessage={errors.title}
          />
          <Input
            id="page-path"
            name="path"
            label={{
              className: 'govuk-label--s',
              children: [i18n('page.path')]
            }}
            hint={{
              children: [i18n('page.pathHint')]
            }}
            value={path}
            onChange={this.onChangePath}
            errorMessage={errors.path}
          />
          {!sections.length && (
            <>
              <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
                {i18n('page.section')}
              </h4>
              <p className="govuk-hint govuk-!-margin-top-0">
                {i18n('page.sectionHint')}
              </p>
            </>
          )}
          {sections.length > 0 && (
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="page-section"
              >
                {i18n('page.section')}
              </label>
              <div className="govuk-hint">{i18n('page.sectionHint')}</div>
              <select
                className="govuk-select"
                id="page-section"
                name="section"
                value={section}
                onChange={this.onChangeSection}
              >
                <option value="" />
                {sections.map((section) => (
                  <option key={section.name} value={section.name}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className="govuk-body">
            {section && (
              <a
                href="#"
                className="govuk-link govuk-!-display-block"
                onClick={this.editSection}
              >
                {i18n('section.edit')}
              </a>
            )}
            {!section && (
              <a
                href="#"
                className="govuk-link govuk-!-display-block"
                onClick={(e) => this.editSection(e, true)}
              >
                {i18n('section.create')}
              </a>
            )}
          </p>
          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              {i18n('save')}
            </button>
            <button
              className="govuk-button govuk-button--warning"
              type="button"
              onClick={this.onClickDelete}
            >
              {i18n('delete')}
            </button>
          </div>
        </form>
        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                section?.name
                  ? i18n('section.editingTitle', { title: section.title })
                  : i18n('section.newTitle')
              }
              onHide={this.closeFlyout}
              show={isEditingSection}
            >
              <SectionEdit
                section={isNewSection ? {} : this.findSectionWithName(section)}
                onEdit={this.closeFlyout}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </div>
    )
  }
}
