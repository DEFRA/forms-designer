import { within } from '@testing-library/dom'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Search Component', () => {
  /** @type {HTMLElement} */
  let $search

  describe('With search data', () => {
    describe('Standard search', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            search: {
              title: 'Some Form'
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render the search component', () => {
        expect($search).toBeInTheDocument()
      })

      it('should have the correct form attributes', () => {
        expect($search).toHaveAttribute('method', 'get')
        expect($search).toHaveAttribute('action', '/library')
        expect($search).toHaveAttribute(
          'aria-labelledby',
          'search-form-heading'
        )
      })

      it('should render the search heading', () => {
        const $heading = within($search).getByRole('heading', {
          name: 'Search'
        })
        expect($heading).toBeInTheDocument()
        expect($heading).toHaveClass('govuk-heading-m')
      })

      it('should render the form name input with correct attributes', () => {
        const $input = within($search).getByRole('textbox', {
          name: 'Form name'
        })

        expect($input).toBeInTheDocument()
        expect($input).toHaveAttribute('id', 'form-title')
        expect($input).toHaveAttribute('name', 'title')
        expect($input).toHaveValue('Some Form')
        expect($input).toHaveClass('govuk-!-width-full')
      })

      it('should render the applied filters section', () => {
        const $filtersHeading = within($search).getByRole('heading', {
          name: 'Applied filters:'
        })
        expect($filtersHeading).toBeInTheDocument()

        const $filtersList = within($search).getByRole('list')
        const $filterItems = within($filtersList).getAllByRole('listitem')
        expect($filterItems[0]).toHaveTextContent('Name: Some Form')
      })

      it('should render the button group', () => {
        const $applyButton = within($search).getByRole('button', {
          name: 'Apply filters'
        })
        expect($applyButton).toBeInTheDocument()
        expect($applyButton).toHaveClass('app-search-form__submit')

        const $clearButton = within($search).getByRole('button', {
          name: 'Clear filters'
        })
        expect($clearButton).toBeInTheDocument()
        expect($clearButton).toHaveClass('govuk-button--secondary')
        expect($clearButton).toHaveAttribute('href', '/library')
      })
    })

    describe('Without search title', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            search: {}
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render the search component without applied filters', () => {
        const $filtersSection = within($search).queryByRole('heading', {
          name: 'Applied filters:'
        })
        expect($filtersSection).not.toBeInTheDocument()
      })

      it('should render empty input field', () => {
        const $input = within($search).getByRole('textbox', {
          name: 'Form name'
        })
        expect($input).toHaveValue('')
      })
    })

    describe('With different base URL', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/different-path',
            search: {
              title: 'Test Form'
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should use the hardcoded library URL for form action', () => {
        expect($search).toHaveAttribute('action', '/library')
      })

      it('should use the correct base URL for clear filters button', () => {
        const $clearButton = within($search).getByRole('button', {
          name: 'Clear filters'
        })
        expect($clearButton).toHaveAttribute('href', '/different-path')
      })
    })

    describe('With sorting parameters', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            search: {
              title: 'Some Form'
            },
            sorting: {
              sortBy: 'title',
              order: 'asc'
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should include sort parameter in hidden input', () => {
        const $sortInput = within($search).getByDisplayValue('titleAsc')
        expect($sortInput).toBeInTheDocument()
        expect($sortInput).toHaveAttribute('type', 'hidden')
        expect($sortInput).toHaveAttribute('name', 'sort')
      })
    })
  })

  describe('Without search data', () => {
    beforeEach(() => {
      const { container } = renderMacro('appSearch', 'search/macro.njk', {
        params: {
          baseUrl: '/library'
        }
      })

      $search = container.getByRole('form', { name: 'Search' })
    })

    it('should include default sort parameter in hidden input', () => {
      const $sortInput = within($search).getByDisplayValue('updatedDesc')
      expect($sortInput).toBeInTheDocument()
      expect($sortInput).toHaveAttribute('type', 'hidden')
      expect($sortInput).toHaveAttribute('name', 'sort')
    })

    it('should render the search component without applied filters', () => {
      const $filtersSection = within($search).queryByRole('heading', {
        name: 'Applied filters:'
      })
      expect($filtersSection).not.toBeInTheDocument()
    })

    it('should render empty input field', () => {
      const $input = within($search).getByRole('textbox', {
        name: 'Form name'
      })
      expect($input).toHaveValue('')
    })
  })

  describe('Without any params', () => {
    it('should render a basic search component', () => {
      const { container } = renderMacro('appSearch', 'search/macro.njk')

      const $search = container.getByRole('form', {
        name: 'Search'
      })

      expect($search).toBeInTheDocument()
      expect($search).toHaveAttribute('action', '/library')

      const $filtersSection = within($search).queryByRole('heading', {
        name: 'Applied filters:'
      })
      expect($filtersSection).not.toBeInTheDocument()

      const $input = within($search).getByRole('textbox', {
        name: 'Form name'
      })
      expect($input).toHaveValue('')
    })
  })
})
