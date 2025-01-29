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

      it('should render the button groups', () => {
        const $applyButtons = within($search).getAllByRole('button', {
          name: 'Apply filters'
        })
        expect($applyButtons).toHaveLength(2)
        $applyButtons.forEach(($button) => {
          expect($button).toHaveClass('app-search-form__submit')
        })

        const $clearButtons = within($search).getAllByRole('button', {
          name: 'Clear filters'
        })
        expect($clearButtons).toHaveLength(2)
        $clearButtons.forEach(($button) => {
          expect($button).toHaveClass('govuk-button--secondary')
          expect($button).toHaveAttribute('href', '/library')
        })
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

      it('should use the correct base URL for clear filters buttons', () => {
        const $clearButtons = within($search).getAllByRole('button', {
          name: 'Clear filters'
        })
        expect($clearButtons).toHaveLength(2)
        $clearButtons.forEach(($button) => {
          expect($button).toHaveAttribute('href', '/different-path')
        })
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

    describe('With author search', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            displayName: 'Current User',
            search: {
              author: 'Current User'
            },
            filters: {
              authors: ['Current User', 'Other Author']
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render the author filter in applied filters', () => {
        const $filtersList = within($search).getByRole('list')
        const $filterItems = within($filtersList).getAllByRole('listitem')
        expect($filterItems).toHaveLength(1)
        expect($filterItems[0]).toHaveTextContent('Author: Me (Current User)')
      })

      it('should render the authors radio group', () => {
        const $authorsGroup = within($search).getByRole('group', {
          name: 'Select all authors that apply'
        })
        expect($authorsGroup).toBeInTheDocument()

        const $options = within($authorsGroup).getAllByRole('radio')
        expect($options).toHaveLength(3)
        expect($options[0]).toBeChecked()
        expect($options[1]).not.toBeChecked()
        expect($options[2]).not.toBeChecked()

        expect($authorsGroup).toHaveFormValues({
          author: 'Current User'
        })
      })

      describe('when "All authors" is selected', () => {
        beforeEach(() => {
          const { container } = renderMacro('appSearch', 'search/macro.njk', {
            params: {
              baseUrl: '/library',
              search: {
                author: 'all'
              },
              filters: {
                authors: ['Current User', 'Other Author']
              }
            }
          })

          $search = container.getByRole('form', { name: 'Search' })
        })

        it('should render "all" in the applied filters', () => {
          const $filtersList = within($search).getByRole('list')
          const $filterItems = within($filtersList).getAllByRole('listitem')
          expect($filterItems).toHaveLength(1)
          expect($filterItems[0]).toHaveTextContent('Author: all')
        })

        it('should have "All authors" radio option checked', () => {
          const $authorsGroup = within($search).getByRole('group', {
            name: 'Select all authors that apply'
          })
          const $options = within($authorsGroup).getAllByRole('radio')
          expect($options[2]).toBeChecked()

          expect($authorsGroup).toHaveFormValues({
            author: 'all'
          })
        })
      })
    })

    describe('With organisation search', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            search: {
              organisations: ['Defra', 'Environment Agency']
            },
            filters: {
              organisations: ['Defra', 'Environment Agency', 'Natural England']
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render the organisation filters in applied filters', () => {
        const $filtersList = within($search).getByRole('list')
        const $filterItems = within($filtersList).getAllByRole('listitem')
        expect($filterItems).toHaveLength(2)
        expect($filterItems[0]).toHaveTextContent('Author: all')
        expect($filterItems[1]).toHaveTextContent(
          'Organisation: Defra, Environment Agency'
        )
      })

      it('should render the organisations checkbox group', () => {
        const $orgCheckboxes = within($search).getByRole('group', {
          name: 'Select all organisations that apply'
        })
        expect($orgCheckboxes).toBeInTheDocument()

        const $options = within($orgCheckboxes).getAllByRole('checkbox')
        expect($options).toHaveLength(3)
        expect($options[0]).toBeChecked()
        expect($options[1]).toBeChecked()
        expect($options[2]).not.toBeChecked()
      })
    })

    describe('With status search', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            search: {
              status: ['draft', 'live']
            },
            filters: {
              statuses: ['draft', 'live']
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render the status filters in applied filters', () => {
        const $filtersList = within($search).getByRole('list')
        const $filterItems = within($filtersList).getAllByRole('listitem')
        expect($filterItems).toHaveLength(3)
        expect($filterItems[0]).toHaveTextContent('Author: all')
        expect($filterItems[1]).toHaveTextContent('State: Draft')
        expect($filterItems[2]).toHaveTextContent('State: Live')
      })

      it('should render the status checkbox group', () => {
        const $statusCheckboxes = within($search).getByRole('group', {
          name: 'Select all states that apply'
        })
        expect($statusCheckboxes).toBeInTheDocument()

        const $options = within($statusCheckboxes).getAllByRole('checkbox')
        expect($options).toHaveLength(2)
        expect($options[0]).toBeChecked()
        expect($options[1]).toBeChecked()
      })
    })

    describe('With all filter types', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSearch', 'search/macro.njk', {
          params: {
            baseUrl: '/library',
            displayName: 'Current User',
            search: {
              title: 'Test Form',
              author: 'Current User',
              organisations: ['Defra'],
              status: ['draft']
            },
            filters: {
              authors: ['Current User', 'Other Author'],
              organisations: ['Defra', 'Environment Agency'],
              statuses: ['draft', 'live']
            }
          }
        })

        $search = container.getByRole('form', { name: 'Search' })
      })

      it('should render all applied filters in correct order', () => {
        const $filtersList = within($search).getByRole('list')
        const $filterItems = within($filtersList).getAllByRole('listitem')
        expect($filterItems).toHaveLength(4)
        expect($filterItems[0]).toHaveTextContent('Name: Test Form')
        expect($filterItems[1]).toHaveTextContent('Author: Me (Current User)')
        expect($filterItems[2]).toHaveTextContent('Organisation: Defra')
        expect($filterItems[3]).toHaveTextContent('State: Draft')
      })

      it('should expand all filter sections with active filters', () => {
        const $accordionSections = within($search).getAllByRole('heading', {
          level: 2,
          name: /Authors|Organisation|State/
        })

        $accordionSections.forEach(($heading) => {
          const $section = $heading.closest('.govuk-accordion__section')
          expect($section).toHaveClass('govuk-accordion__section--expanded')
        })
      })
    })
  })

  describe('Without search data', () => {
    beforeEach(() => {
      const { container } = renderMacro('appSearch', 'search/macro.njk', {
        params: {
          baseUrl: '/library',
          displayName: 'Current User',
          filters: {
            authors: ['Current User', 'Other Author']
          }
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

    it('should have "All authors" radio option checked by default', () => {
      const $authorsGroup = within($search).getByRole('group', {
        name: 'Select all authors that apply'
      })
      const $options = within($authorsGroup).getAllByRole('radio')
      expect($options).toHaveLength(3)
      expect($options[0]).not.toBeChecked()
      expect($options[1]).not.toBeChecked()
      expect($options[2]).toBeChecked()

      expect($authorsGroup).toHaveFormValues({
        author: 'all'
      })
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
