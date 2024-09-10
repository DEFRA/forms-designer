import {
  ControllerPath,
  ControllerType,
  PageTypes,
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
import classNames from 'classnames'
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
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { findSection } from '~/src/data/section/findSection.js'
import { isControllerAllowed } from '~/src/helpers.js'
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
  section?: Section
  isEditingSection: boolean
  isNewSection: boolean
  isQuestionPage: boolean
  errors: Partial<ErrorList<'path' | 'title' | 'controller'>>
}

interface Form {
  path: string
  title: string
  controller: ControllerType
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
      path: isQuestionPage ? `/${slugify(path)}` : defaults.path,
      controller: controller ? defaults.controller : undefined
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
      if (payload.controller === ControllerType.Page) {
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

    errors.controller = validateRequired('page-controller', controller, {
      label: i18n('addPage.controllerOption.title'),
      message: 'addPage.controllerOption.option'
    })

    errors.title = validateRequired('page-title', title, {
      label: i18n('addPage.pageTitleField.title')
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
      isQuestionPage: controller ? isQuestionPage({ controller }) : false,

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

    const { sections } = data
    const hasErrors = hasValidationErrors(errors)
    const pageTypes = PageTypes.filter(isControllerAllowed(data, page))

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
          <div
            className={classNames('govuk-form-group', {
              'govuk-form-group--error': errors.controller
            })}
          >
            <label
              className="govuk-label govuk-label--s"
              htmlFor="page-controller"
            >
              {i18n('addPage.controllerOption.title')}
            </label>
            <div className="govuk-hint" id="page-controller-hint">
              {i18n('addPage.controllerOption.helpText')}
            </div>
            {errors.controller && (
              <ErrorMessage id="page-controller-error">
                {errors.controller.children}
              </ErrorMessage>
            )}
            <select
              className={classNames('govuk-select', {
                'govuk-select--error': errors.controller
              })}
              id="page-controller"
              aria-describedby={
                'page-controller-hint' +
                (errors.controller ? 'page-controller-error' : '')
              }
              name="controller"
              value={controller ?? ''}
              onChange={this.onChangeController}
            >
              <option value="">
                {i18n('addPage.controllerOption.option')}
              </option>
              {pageTypes.map((pageType) => (
                <option key={pageType.title} value={pageType.controller}>
                  {pageType.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="page-title"
            name="title"
            label={{
              className: 'govuk-label--s',
              children: [i18n('addPage.pageTitleField.title')]
            }}
            value={title ?? ''}
            onChange={this.onChangeTitle}
            errorMessage={errors.title}
          />

          {isQuestionPage && (
            <Input
              id="page-path"
              name="path"
              label={{
                className: 'govuk-label--s',
                children: [i18n('addPage.pathField.title')]
              }}
              hint={{
                children: [i18n('addPage.pathField.helpText')]
              }}
              value={path ?? ''}
              onChange={this.onChangePath}
              errorMessage={errors.path}
            />
          )}

          {(isQuestionPage || controller === ControllerType.Start) && (
            <>
              {!sections.length && (
                <>
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
                    {i18n('addPage.sectionOption.title')}
                  </h3>
                  <p className="govuk-hint govuk-!-margin-top-0">
                    {i18n('addPage.sectionOption.helpText')}
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
                      {i18n('addPage.sectionOption.title')}
                    </label>
                    <div className="govuk-hint" id="page-section-hint">
                      {i18n('addPage.sectionOption.helpText')}
                    </div>
                    <select
                      className="govuk-select"
                      id="page-section"
                      aria-describedby="page-section-hint"
                      name="section"
                      value={section?.name ?? ''}
                      onChange={this.onChangeSection}
                    >
                      <option value="">
                        {i18n('addPage.sectionOption.option')}
                      </option>
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
