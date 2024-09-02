import {
  ControllerPath,
  ControllerType,
  controllerNameFromPath,
  getPageDefaults,
  hasComponents,
  hasNext,
  hasSection,
  isQuestionPage,
  slugify,
  type Page,
  type Section
} from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import Joi from 'joi'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { type ErrorList, ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { findPathsTo } from '~/src/data/page/findPathsTo.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { findSection } from '~/src/data/section/findSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import {
  validateCustom,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

interface State extends Partial<Form> {
  controller?: ControllerType
  section?: Section
  isEditingSection: boolean
  isNewSection: boolean
  isQuestionPage: boolean
  errors: Partial<ErrorList<'path' | 'title'>>
}

interface Form {
  path: string
  title: string
}

export class PageEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {
    isEditingSection: false,
    isNewSection: false,
    isQuestionPage: true,
    errors: {}
  }

  componentDidMount() {
    const { page } = this.props
    const { data } = this.context

    const { path, title } = page
    const controller = controllerNameFromPath(page.controller)

    this.setState({
      path,
      controller,
      title,
      section: hasSection(page) ? findSection(data, page.section) : undefined,
      isQuestionPage: isQuestionPage(page)
    })
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { save, data } = this.context
    const { title, path, section, controller, isQuestionPage } = this.state
    const { page, onSave } = this.props

    // Page defaults
    const defaults = getPageDefaults({ controller })

    // Remove trailing spaces and hyphens
    const payload = {
      title: title?.trim(),
      path: isQuestionPage ? `/${slugify(path)}` : defaults.path
    }

    // Check for valid form payload
    if (!this.validate(payload)) {
      return
    }

    let definition = structuredClone(data)

    const pageEdit = findPage(definition, page.path)
    const pageIndex = definition.pages.indexOf(pageEdit)

    const pageUpdate = defaults
    pageUpdate.title = payload.title

    // Update question page fields
    if (hasComponents(pageUpdate)) {
      pageUpdate.path = payload.path
      pageUpdate.section = section?.name

      // Remove default controller
      if (controller === ControllerType.Page) {
        delete pageUpdate.controller
      }
    }

    // Copy over components
    if (hasComponents(pageEdit) && hasComponents(pageUpdate)) {
      pageUpdate.components = pageEdit.components
    }

    // Copy over links
    if (hasNext(pageEdit) && hasNext(pageUpdate)) {
      pageUpdate.next = pageEdit.next
    }

    // Update links
    definition = updateLinksTo(definition, pageEdit, pageUpdate)

    // Update page
    definition.pages[pageIndex] = pageUpdate

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  validate = (payload: Partial<Form>): payload is Form => {
    const { controller } = this.state

    const { title, path } = payload

    const errors: State['errors'] = {}

    errors.title = validateRequired('page-title', title, {
      label: i18n('page.title')
    })

    // Path '/status' not allowed
    errors.path = validateCustom('page-path', path, {
      message: 'page.errors.pathStart',
      schema: Joi.string().disallow(ControllerPath.Status)
    })

    // Path '/start' not allowed
    if (controller !== ControllerType.Start) {
      errors.path ??= validateCustom('page-path', path, {
        message: 'page.errors.pathStart',
        schema: Joi.string().disallow(ControllerPath.Start)
      })
    }

    // Path '/summary' not allowed
    if (controller !== ControllerType.Summary) {
      errors.path ??= validateCustom('page-path', path, {
        message: 'page.errors.pathSummary',
        schema: Joi.string().disallow(ControllerPath.Summary)
      })
    }

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { save, data } = this.context
    const { page, onSave } = this.props

    let definition = structuredClone(data)

    const pageRemove = findPage(definition, page.path)
    const pageIndex = definition.pages.indexOf(pageRemove)

    // Remove all links to the page
    for (const pageFrom of definition.pages.filter(hasNext)) {
      const { next } = pageFrom

      // Remove link
      if (next.some(({ path }) => path === pageRemove.path)) {
        definition = deleteLink(definition, pageFrom, pageRemove)
      }
    }

    // Remove page
    definition.pages.splice(pageIndex, 1)

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  onChangeController = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const { errors } = this.state

    const controller = value ? (value as ControllerType) : undefined

    this.setState({
      controller,

      // Allow question pages to edit section + path
      isQuestionPage: isQuestionPage({ controller }),

      // Reset path errors when controller changes
      errors: {
        ...errors,
        path: undefined
      }
    })
  }

  onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: title } = e.target

    this.onChangePath(e)
    this.setState({ title })
  }

  onChangePath = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: path } = e.target
    const { isQuestionPage } = this.state

    if (!isQuestionPage) {
      return
    }

    this.setState({
      path: `/${slugify(path, { trim: false })}`
    })
  }

  editSection = (e: MouseEvent<HTMLAnchorElement>, isNewSection = false) => {
    e.preventDefault()

    this.setState({
      isEditingSection: true,
      isNewSection
    })
  }

  closeFlyout = (sectionName?: string) => {
    const { data } = this.context
    const { section } = this.state

    this.setState({
      isEditingSection: false,
      isNewSection: false,
      section: sectionName ? findSection(data, sectionName) : section
    })
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: sectionName } = e.target
    const { data } = this.context

    this.setState({
      section: sectionName ? findSection(data, sectionName) : undefined
    })
  }

  render() {
    const { page } = this.props
    const { data } = this.context

    const {
      title,
      path,
      controller,
      section,
      isEditingSection,
      isNewSection,
      isQuestionPage,
      errors
    } = this.state

    const { pages, sections } = data
    const hasErrors = hasValidationErrors(errors)

    // Check if we already have a start page
    const hasStartPage = pages.some(
      (page) => page.controller === ControllerType.Start
    )

    // Check if we already have a summary page
    const hasSummaryPage = pages.some(
      (page) => page.controller === ControllerType.Summary
    )

    // Check if we have a link from another page
    const hasLinkFrom = findPathsTo(data, page.path).length > 1

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="controller">
              {i18n('page.controller')}
            </label>
            <div className="govuk-hint" id="controller-hint">
              {i18n('page.controllerHint')}
            </div>
            <select
              className="govuk-select"
              id="controller"
              aria-describedby="controller-hint"
              name="controller"
              value={controller}
              onChange={this.onChangeController}
            >
              <option value={ControllerType.Page}>
                {i18n('page.controllers.question')}
              </option>
              {((!hasStartPage && !hasLinkFrom) ||
                page.controller === ControllerType.Start) && (
                <option value={ControllerType.Start}>
                  {i18n('page.controllers.start')}
                </option>
              )}
              <option value={ControllerType.FileUpload}>
                {i18n('page.controllers.fileUpload')}
              </option>
              {(!hasSummaryPage ||
                page.controller === ControllerType.Summary) && (
                <option value={ControllerType.Summary}>
                  {i18n('page.controllers.summary')}
                </option>
              )}
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

          {isQuestionPage && (
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
          )}

          {(isQuestionPage || controller === ControllerType.Start) && (
            <>
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

              <div className="govuk-form-group">
                {sections.length > 0 && (
                  <>
                    <label
                      className="govuk-label govuk-label--s"
                      htmlFor="page-section"
                    >
                      {i18n('page.section')}
                    </label>
                    <div className="govuk-hint" id="page-section-hint">
                      {i18n('page.sectionHint')}
                    </div>
                    <select
                      className="govuk-select"
                      id="page-section"
                      aria-describedby="page-section-hint"
                      name="section"
                      value={section?.name ?? ''}
                      onChange={this.onChangeSection}
                    >
                      <option value="">{i18n('page.sectionOption')}</option>
                      {sections.map((section) => (
                        <option key={section.name} value={section.name}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <p className="govuk-body govuk-!-margin-top-2">
                  {section && (
                    <a
                      href="#"
                      className="govuk-link govuk-!-display-block"
                      onClick={this.editSection}
                    >
                      {i18n('section.edit')}
                    </a>
                  )}
                  <a
                    href="#"
                    className="govuk-link govuk-!-display-block"
                    onClick={(e) => this.editSection(e, true)}
                  >
                    {i18n('section.add')}
                  </a>
                </p>
              </div>
            </>
          )}

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
                !isNewSection && !!section
                  ? i18n('section.editTitle', { title: section.title })
                  : i18n('section.add')
              }
              onHide={this.closeFlyout}
            >
              <SectionEdit
                section={!isNewSection ? section : undefined}
                onSave={this.closeFlyout}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
