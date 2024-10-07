import {
  ControllerType,
  type FormDefinition,
  type Page,
  type Section
} from '@defra/forms-model'
import { screen } from '@testing-library/dom'
import { render, type RenderResult } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { PageEdit } from '~/src/PageEdit.jsx'
import { RenderWithContext } from '~/test/helpers/renderers.jsx'

describe('Page edit: Existing page', () => {
  let pages: Page[]
  let sections: Section[]
  let data: FormDefinition
  let result: RenderResult

  beforeEach(() => {
    pages = [
      {
        title: 'Question page 1',
        path: '/question-one',
        next: [{ path: '/question-two' }],
        components: []
      },
      {
        title: 'Question page 2',
        path: '/question-two',
        next: [],
        components: []
      }
    ]

    sections = [
      {
        name: 'section1',
        title: 'Section 1'
      }
    ]

    data = {
      pages,
      lists: [],
      sections,
      conditions: []
    }
  })

  describe.each([
    [
      ControllerType.Start,
      {
        path: false,
        section: true
      }
    ],
    [
      ControllerType.Page,
      {
        path: true,
        section: true
      }
    ],
    [
      ControllerType.FileUpload,
      {
        path: true,
        section: true
      }
    ],
    [
      ControllerType.Summary,
      {
        path: false,
        section: false
      }
    ]
  ])('Fields: %s', (controller, options) => {
    let page: Page
    let section: Section

    beforeEach(() => {
      page = pages[1]
      section = sections[0]

      page.controller = controller

      result = render(
        <RenderWithContext data={data}>
          <PageEdit page={page} onSave={jest.fn()} />
        </RenderWithContext>
      )
    })

    it("should render 'Page type' options", () => {
      const $select = screen.getByRole('combobox', { name: 'Page type' })

      expect($select).toBeInTheDocument()
      expect($select).toHaveValue(page.controller)
    })

    it("should render 'Page title' input", () => {
      const $input = screen.getByRole('textbox', { name: 'Page title' })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue(page.title)
    })

    if (options.path) {
      it("should render 'Path' input", () => {
        const $input = screen.getByRole('textbox', { name: 'Path' })

        expect($input).toBeInTheDocument()
        expect($input).toHaveValue(page.path)
      })
    } else {
      it("should not render 'Path' input", () => {
        const $input = screen.queryByRole('textbox', {
          name: 'Path'
        })

        expect($input).not.toBeInTheDocument()
      })
    }

    if (options.section) {
      it("should render 'Section' options (value empty)", () => {
        const $select = screen.getByRole('combobox', {
          name: 'Section (optional)',
          description:
            'Use sections to split a form. For example, to add a section per applicant. The section title appears above the page title. However, if these titles are the same, the form will only show the page title.'
        })

        expect($select).toBeInTheDocument()
        expect($select).toHaveValue('')

        expect(
          screen.getByRole('link', { name: 'Add a new section' })
        ).toBeInTheDocument()

        expect(
          screen.queryByRole('link', { name: 'Edit section' })
        ).not.toBeInTheDocument()
      })

      it("should render 'Section' options (value preselected)", () => {
        result.unmount()

        page.section = section.name

        render(
          <RenderWithContext data={data}>
            <PageEdit page={page} onSave={jest.fn()} />
          </RenderWithContext>
        )

        expect(
          screen.getByRole('combobox', { name: 'Section (optional)' })
        ).toHaveValue(section.name)

        expect(
          screen.getByRole('link', { name: 'Add a new section' })
        ).toBeInTheDocument()

        expect(
          screen.getByRole('link', { name: 'Edit section' })
        ).toBeInTheDocument()
      })

      it("should not render 'Section' options (changing page type)", async () => {
        const $pageType = screen.getByRole('combobox', { name: 'Page type' })
        await userEvent.selectOptions($pageType, ControllerType.Summary)

        expect(
          screen.queryByRole('combobox', { name: 'Section (optional)' })
        ).not.toBeInTheDocument()
      })
    } else {
      it("should not render 'Section' options", () => {
        const $select = screen.queryByRole('combobox', {
          name: 'Section (optional)'
        })

        expect($select).not.toBeInTheDocument()
      })

      it("should render 'Section' options (changing page type)", async () => {
        const $pageType = screen.getByRole('combobox', { name: 'Page type' })
        await userEvent.selectOptions($pageType, ControllerType.Page)

        expect(
          screen.getByRole('combobox', { name: 'Section (optional)' })
        ).toBeInTheDocument()

        expect(
          screen.getByRole('link', { name: 'Add a new section' })
        ).toBeInTheDocument()

        expect(
          screen.queryByRole('link', { name: 'Edit section' })
        ).not.toBeInTheDocument()
      })
    }

    it("should not render 'Link from' options", () => {
      const $select = screen.queryByRole('combobox', {
        name: 'Link from (optional)'
      })

      expect($select).not.toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    let save: jest.Mock
    let onSave: jest.Mock
    let page: Page

    let $pageType: HTMLSelectElement
    let $pageTitle: HTMLInputElement
    let $buttonSave: HTMLButtonElement
    let $buttonDelete: HTMLButtonElement

    beforeEach(() => {
      save = jest.fn()
      onSave = jest.fn()
      page = pages[1]

      render(
        <RenderWithContext data={data} save={save}>
          <PageEdit page={page} onSave={onSave} />
        </RenderWithContext>
      )

      $pageType = screen.getByRole('combobox', { name: 'Page type' })
      $pageTitle = screen.getByRole('textbox', { name: 'Page title' })
      $buttonSave = screen.getByRole('button', { name: 'Save' })
      $buttonDelete = screen.getByRole('button', { name: 'Delete' })
    })

    it('should prevent save when invalid', async () => {
      await userEvent.selectOptions($pageType, '')
      await userEvent.clear($pageTitle)
      await userEvent.click($buttonSave)

      // Not saved
      expect(onSave).not.toHaveBeenCalled()
    })

    it('should allow save when valid', async () => {
      await userEvent.click($buttonSave)
      expect(onSave).toHaveBeenCalled()
    })

    it('should allow save when valid (changing page type)', async () => {
      await userEvent.selectOptions($pageType, ControllerType.Summary)
      await userEvent.click($buttonSave)

      expect(onSave).toHaveBeenCalled()
    })

    it('should prevent save when cancelling delete', async () => {
      jest.spyOn(window, 'confirm').mockImplementation(() => false)

      await userEvent.click($buttonDelete)

      expect(window.confirm).toHaveBeenCalled()
      expect(onSave).not.toHaveBeenCalled()
    })

    it('should allow save when confirming delete', async () => {
      jest.spyOn(window, 'confirm').mockImplementation(() => true)

      await userEvent.click($buttonDelete)

      expect(window.confirm).toHaveBeenCalled()
      expect(onSave).toHaveBeenCalled()

      expect(save).toHaveBeenCalledWith(
        expect.objectContaining<Partial<FormDefinition>>({
          pages: [
            {
              title: 'Question page 1',
              path: '/question-one',
              next: [], // Link to deleted page removed
              components: []
            }
          ]
        })
      )
    })
  })
})

describe('Page edit: New page', () => {
  let pages: Page[]
  let sections: Section[]
  let data: FormDefinition

  let onSave: jest.Mock
  let page: Page
  let section: Section

  let $pageType: HTMLSelectElement
  let $pageTitle: HTMLInputElement
  let $buttonSave: HTMLButtonElement

  beforeEach(() => {
    pages = [
      {
        title: 'Question page 1',
        path: '/question-one',
        next: [],
        components: []
      }
    ]

    sections = [
      {
        name: 'section1',
        title: 'Section 1'
      }
    ]

    data = {
      pages,
      lists: [],
      sections,
      conditions: []
    }

    onSave = jest.fn()
    page = pages[0]
    section = sections[0]

    render(
      <RenderWithContext data={data}>
        <PageEdit onSave={onSave} />
      </RenderWithContext>
    )

    $pageType = screen.getByRole('combobox', { name: 'Page type' })
    $pageTitle = screen.getByRole('textbox', { name: 'Page title' })
    $buttonSave = screen.getByRole('button', { name: 'Save' })
  })

  describe('Fields', () => {
    it("should render 'Page type' options", async () => {
      expect($pageType).toBeInTheDocument()
      expect($pageType).toHaveValue(ControllerType.Page)

      // Reset value and submit
      await userEvent.selectOptions($pageType, '')
      await userEvent.click($buttonSave)

      // Check for error
      expect($pageType).toHaveAccessibleDescription(
        expect.stringContaining('Error: Select a page type')
      )

      // Not saved
      expect(onSave).not.toHaveBeenCalled()
    })

    it("should render 'Page title' input", async () => {
      expect($pageTitle).toBeInTheDocument()
      expect($pageTitle).toHaveValue('')

      // Submit default value
      await userEvent.click($buttonSave)

      // Check for error
      expect($pageTitle).toHaveAccessibleDescription(
        expect.stringContaining('Error: Enter page title')
      )

      // Not saved
      expect(onSave).not.toHaveBeenCalled()
    })

    it("should render 'Path' input", () => {
      const $path = screen.getByRole('textbox', {
        name: 'Path',
        description:
          'Appears in the browser path. The value you enter in the page title field automatically populates the path name. To override it, enter your own path name, relevant to the page, and use lowercase text and hyphens between words. For example, ‘/personal-details’'
      })

      expect($path).toBeInTheDocument()
      expect($path).toHaveValue('/')
    })

    it("should render 'Section' options", async () => {
      const $select = screen.getByRole('combobox', {
        name: 'Section (optional)',
        description:
          'Use sections to split a form. For example, to add a section per applicant. The section title appears above the page title. However, if these titles are the same, the form will only show the page title.'
      })

      expect($select).toBeInTheDocument()
      expect($select).toHaveValue('')

      expect(
        screen.getByRole('link', { name: 'Add a new section' })
      ).toBeInTheDocument()

      // Select section
      await userEvent.selectOptions($select, section.name)

      // Edit section shown
      expect(
        screen.getByRole('link', { name: 'Edit section' })
      ).toBeInTheDocument()

      // Unselect section
      await userEvent.selectOptions($select, '')

      // Edit section not shown
      expect(
        screen.queryByRole('link', { name: 'Edit section' })
      ).not.toBeInTheDocument()
    })

    it("should render 'Link from' options", async () => {
      const $select = screen.getByRole('combobox', {
        name: 'Link from (optional)',
        description: 'Add a link to this page from a different page in the form'
      })

      expect($select).toBeInTheDocument()
      expect($select).toHaveValue('')

      // Select page
      await userEvent.selectOptions($select, page.path)

      // Conditions shown
      expect(
        screen.getByRole('heading', { name: 'Conditions (optional)' })
      ).toBeInTheDocument()

      // Unselect page
      await userEvent.selectOptions($select, '')

      // Conditions not shown
      expect(
        screen.queryByRole('heading', { name: 'Conditions (optional)' })
      ).not.toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    let page: Page
    let section: Section

    let $path: HTMLInputElement
    let $section: HTMLSelectElement
    let $linkFrom: HTMLSelectElement

    beforeEach(() => {
      page = pages[0]
      section = sections[0]

      $path = screen.getByRole('textbox', {
        name: 'Path'
      })

      $section = screen.getByRole('combobox', {
        name: 'Section (optional)'
      })

      $linkFrom = screen.getByRole('combobox', {
        name: 'Link from (optional)'
      })
    })

    it('should prevent save when invalid', async () => {
      await userEvent.selectOptions($pageType, '')
      await userEvent.clear($pageTitle)
      await userEvent.click($buttonSave)

      // Not saved
      expect(onSave).not.toHaveBeenCalled()
    })

    it('should allow save when valid', async () => {
      await userEvent.selectOptions($pageType, ControllerType.Page)
      await userEvent.type($pageTitle, 'Another page')

      await userEvent.click($buttonSave)
      expect(onSave).toHaveBeenCalled()
    })

    it.each([
      ControllerType.Start,
      ControllerType.Page,
      ControllerType.FileUpload,
      ControllerType.Summary
    ])('should allow save when valid: %s', async (controller) => {
      await userEvent.selectOptions($pageType, controller)
      await userEvent.type($pageTitle, 'Another page')

      await userEvent.click($buttonSave)
      expect(onSave).toHaveBeenCalled()
    })

    it('should allow save when valid (optional fields)', async () => {
      await userEvent.selectOptions($pageType, ControllerType.Page)
      await userEvent.type($pageTitle, 'Another page')

      // Optional fields
      await userEvent.clear($path)
      await userEvent.type($path, 'updated-path')
      await userEvent.selectOptions($section, section.name)
      await userEvent.selectOptions($linkFrom, page.path)

      await userEvent.click($buttonSave)
      expect(onSave).toHaveBeenCalled()
    })
  })
})
