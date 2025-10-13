import {
  ControllerPath,
  ControllerType,
  Engine,
  PageTypes,
  getPageDefaults,
  hasComponents,
  hasFormComponents,
  hasNext,
  hasRepeater,
  randomId,
  slugify,
  type Page
} from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import { type Root } from 'joi'
import {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ErrorSummary, type ErrorList } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { addPage } from '~/src/data/page/addPage.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { findSection } from '~/src/data/section/findSection.js'
import { isComponentAllowed, isControllerAllowed } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import {
  hasValidationErrors,
  validateCustom,
  validateRequired
} from '~/src/validations.js'

interface Props {
  page?: Page
  onSave: () => void
}

interface State extends Partial<Form> {
  defaults: Page
  linkFrom?: string
  selectedCondition?: string
  selectedSection?: string
  selectedPageCondition?: string
  isEditingSection: boolean
  isNewSection: boolean
  pages: Page[]
  errors: Partial<ErrorList<'path' | 'title' | 'controller' | 'repeatTitle'>>
}

interface Form {
  path: string
  title: string
  controller: ControllerType
  repeatTitle: string
}

export class PageEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {
    defaults: getPageDefaults(),
    isEditingSection: false,
    isNewSection: false,
    pages: [],
    errors: {}
  }

  componentDidMount() {
    const { page } = this.props
    const { data } = this.context

    const defaults = getPageDefaults({
      controller: page?.controller ?? ControllerType.Page
    })

    // Sort pages for select menus
    const pages = structuredClone(data.pages).sort(
      ({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB)
    )

    // State for new or existing pages
    this.setState({
      path: '/',
      controller: defaults.controller,
      defaults,
      pages
    })

    if (!page) {
      return
    }

    // State for existing pages only
    this.setState({
      path: page.path,
      title: page.title,
      selectedSection: hasComponents(page) ? page.section : undefined,
      repeatTitle: hasRepeater(page) ? page.repeat.options.title : undefined,
      selectedPageCondition: page.condition ?? undefined
    })
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { page, onSave } = this.props
    const { data, save } = this.context
    const {
      title,
      path,
      controller,
      repeatTitle,
      defaults,
      linkFrom,
      selectedCondition,
      selectedSection,
      selectedPageCondition
    } = this.state

    // Remove trailing spaces and hyphens
    const payload = {
      title: title?.trim(),
      path: hasFormComponents(defaults) ? `/${slugify(path)}` : defaults.path,
      controller: controller ? defaults.controller : undefined,
      repeatTitle: hasRepeater(defaults) ? repeatTitle?.trim() : undefined
    }

    const { default: schema } = await import('joi')

    // Check for valid form payload
    if (!this.validate(payload, schema)) {
      return
    }

    let definition = structuredClone(data)

    const pageUpdate = defaults
    pageUpdate.title = payload.title

    // Update question page fields
    if (hasComponents(pageUpdate)) {
      pageUpdate.path = payload.path
      pageUpdate.section = selectedSection
      pageUpdate.condition = selectedPageCondition

      // Remove default controller
      if (payload.controller === ControllerType.Page) {
        delete pageUpdate.controller
      }
    }

    // Set repeat options
    if (hasRepeater(pageUpdate)) {
      pageUpdate.repeat.options.name = randomId()
      pageUpdate.repeat.options.title = payload.repeatTitle
    }

    // Add new page
    if (!page) {
      definition = addPage(definition, pageUpdate)

      if (linkFrom) {
        const pageFrom = findPage(definition, linkFrom)

        // Add link from the selected page
        definition = addLink(definition, pageFrom, pageUpdate, {
          condition: selectedCondition
        })
      }
    }

    // Edit existing (or newly added) page
    const pageEdit = findPage(definition, page?.path ?? pageUpdate.path)
    const pageIndex = definition.pages.indexOf(pageEdit)

    // Copy over allowed components only
    if (hasComponents(pageEdit) && hasComponents(pageUpdate)) {
      pageUpdate.components.unshift(
        ...pageEdit.components.filter(
          isComponentAllowed({ controller: payload.controller })
        )
      )
    }

    // Copy over repeat option name
    if (hasRepeater(pageEdit) && hasRepeater(pageUpdate)) {
      pageUpdate.repeat.options.name = pageEdit.repeat.options.name
    }

    // Copy over links
    if (hasNext(pageEdit) && hasNext(pageUpdate)) {
      pageUpdate.next = pageEdit.next
    }

    // Update links
    definition = updateLinksTo(definition, pageEdit, pageUpdate)

    // Replace page with updated template
    definition.pages[pageIndex] = pageUpdate

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  validate = (payload: Partial<Form>, schema: Root): payload is Form => {
    const { page } = this.props
    const { data } = this.context
    const { controller: selectedController } = this.state

    const { controller, title, path, repeatTitle } = payload

    const errors: State['errors'] = {}

    const paths = data.pages
      .filter(({ path }) => path !== page?.path)
      .map(({ path }) => path)

    errors.controller = validateRequired(
      'page-controller',
      selectedController,
      {
        label: i18n('addPage.controllerOption.title'),
        message: 'addPage.controllerOption.option',
        schema
      }
    )

    errors.title = validateRequired('page-title', title, {
      label: i18n('addPage.pageTitleField.title'),
      schema
    })

    errors.path = validateCustom('page-path', [path, ...paths], {
      message: 'errors.duplicate',
      label: `Path '${path}'`,
      schema: schema.array().unique()
    })

    // Path '/status' not allowed
    errors.path ??= validateCustom('page-path', path, {
      message: 'page.errors.pathStatus',
      schema: schema.string().disallow(ControllerPath.Status)
    })

    // Path '/start' not allowed
    if (controller !== ControllerType.Start) {
      errors.path ??= validateCustom('page-path', path, {
        message: 'page.errors.pathStart',
        schema: schema.string().disallow(ControllerPath.Start)
      })
    }

    // Path '/summary' not allowed
    if (controller !== ControllerType.Summary) {
      errors.path ??= validateCustom('page-path', path, {
        message: 'page.errors.pathSummary',
        schema: schema.string().disallow(ControllerPath.Summary)
      })
    }

    if (controller === ControllerType.Repeat) {
      errors.repeatTitle = validateRequired('page-repeat-title', repeatTitle, {
        label: i18n('addPage.repeatTitleField.title'),
        schema
      })
    }

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { page, onSave } = this.props
    const { data, save } = this.context

    if (!window.confirm('Confirm delete') || !page) {
      return
    }

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

  onChangeLinkFrom = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: linkFrom } = e.target

    this.setState({
      linkFrom: linkFrom || undefined
    })
  }

  onChangeController = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const { errors } = this.state

    const controller = value ? (value as ControllerType) : undefined

    const defaults = getPageDefaults({
      controller: controller ?? ControllerType.Page
    })

    this.setState({
      controller,
      defaults,

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
    const { defaults } = this.state

    if (!hasFormComponents(defaults)) {
      return
    }

    this.setState({
      path: `/${slugify(path, { trim: false })}`
    })
  }

  onChangeRepeatTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: repeatTitle } = e.target

    this.setState({ repeatTitle })
  }

  conditionSelected = (selectedCondition?: string) => {
    this.setState({
      selectedCondition
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
    this.setState({
      selectedSection: sectionName,
      isEditingSection: false,
      isNewSection: false
    })
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedSection } = e.target

    this.setState({
      selectedSection: selectedSection || undefined
    })
  }

  pageConditionSelected = (selectedPageCondition?: string) => {
    this.setState({
      selectedPageCondition
    })
  }

  render() {
    const { page } = this.props
    const { data } = this.context

    const {
      title,
      path,
      controller,
      defaults,
      linkFrom,
      selectedSection,
      selectedPageCondition,
      repeatTitle,
      isEditingSection,
      isNewSection,
      pages,
      errors
    } = this.state

    const { engine, sections } = data

    const hasErrors = hasValidationErrors(errors)
    const hasEditPath = !!controller && hasFormComponents(defaults)
    const hasEditSection = !!controller && hasNext(defaults)
    const hasEditRepeater = !!controller && hasRepeater(defaults)
    const hasEditLinkFrom = engine !== Engine.V2 && !page && hasEditPath
    const hasEditPageCondition = engine === Engine.V2 && page

    const pageTypes = PageTypes.filter(
      isControllerAllowed(
        data,
        page ?? {
          controller,
          path
        }
      )
    )

    // Find section by name
    const section =
      isEditingSection && !isNewSection && selectedSection
        ? findSection(data, selectedSection)
        : undefined

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
                (errors.controller ? ' page-controller-error' : '')
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

          {hasEditPath && (
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

          {hasEditRepeater && (
            <Input
              id="page-repeat-title"
              name="repeat-title"
              label={{
                className: 'govuk-label--s',
                children: [i18n('addPage.repeatTitleField.title')]
              }}
              hint={{
                children: [i18n('addPage.repeatTitleField.helpText')]
              }}
              value={repeatTitle ?? ''}
              onChange={this.onChangeRepeatTitle}
              errorMessage={errors.repeatTitle}
            />
          )}

          {hasEditSection && (
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
                      value={selectedSection ?? ''}
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
                  {selectedSection && (
                    <a
                      href="#section-edit"
                      className="govuk-link govuk-!-display-block"
                      onClick={this.editSection}
                    >
                      {i18n('section.edit')}
                    </a>
                  )}
                  <a
                    href="#section-edit"
                    className="govuk-link govuk-!-display-block"
                    onClick={(e) => this.editSection(e, true)}
                  >
                    {i18n('section.add')}
                  </a>
                </p>
              </div>
            </>
          )}

          {hasEditPageCondition && (
            <SelectConditions
              path={page.path}
              selectedCondition={selectedPageCondition}
              conditionsChange={this.pageConditionSelected}
              noFieldsHintText={i18n('conditions.noFieldsAvailable')}
            />
          )}

          {hasEditLinkFrom && (
            <>
              {controller !== ControllerType.Start && (
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-label--s"
                    htmlFor="link-from"
                  >
                    {i18n('addPage.linkFromOption.title')}
                  </label>
                  <div className="govuk-hint" id="link-from-hint">
                    {i18n('addPage.linkFromOption.helpText')}
                  </div>
                  <select
                    className="govuk-select"
                    id="link-from"
                    aria-describedby="link-from-hint"
                    name="from"
                    value={linkFrom ?? ''}
                    onChange={this.onChangeLinkFrom}
                  >
                    <option value="">
                      {i18n('addPage.linkFromOption.option')}
                    </option>
                    {pages.filter(hasNext).map((page) => (
                      <option key={page.path} value={page.path}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {linkFrom && (
                <SelectConditions
                  path={linkFrom}
                  conditionsChange={this.conditionSelected}
                  noFieldsHintText={i18n('conditions.noFieldsAvailable')}
                />
              )}
            </>
          )}

          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              {i18n('save')}
            </button>
            {page && (
              <button
                className="govuk-button govuk-button--warning"
                type="button"
                onClick={this.onClickDelete}
              >
                {i18n('delete')}
              </button>
            )}
          </div>
        </form>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              id="section-edit"
              title={
                section
                  ? i18n('section.editTitle', { title: section.title })
                  : i18n('section.add')
              }
              onHide={this.closeFlyout}
            >
              <SectionEdit section={section} onSave={this.closeFlyout} />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
