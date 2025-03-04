import { within } from '@testing-library/dom'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Sorting Component', () => {
  /** @type {HTMLElement} */
  let $sorting

  describe('With sorting data', () => {
    describe('Standard sorting', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render the sorting component', () => {
        expect($sorting).toBeInTheDocument()
      })

      it('should have the correct form attributes', () => {
        expect($sorting).toHaveAttribute('method', 'get')
        expect($sorting).toHaveAttribute('action', '/library')
        expect($sorting).toHaveAttribute('aria-label', 'Sorting options')
      })

      it('should render the sort select with correct options', () => {
        const $select = within($sorting).getByRole('combobox', {
          name: 'Sort by'
        })

        expect($select).toBeInTheDocument()
        expect($select).toHaveAttribute('id', 'sort-select')
        expect($select).toHaveAttribute('name', 'sort')
        expect($select).toHaveClass('app-field-group__input')

        const $options = within($select).getAllByRole('option')
        expect($options).toHaveLength(4)

        expect($options[0]).toHaveTextContent('Updated (newest)')
        expect($options[0]).toHaveValue('updatedDesc')
        expect($options[0]).toHaveAttribute('selected')

        expect($options[1]).toHaveTextContent('Updated (oldest)')
        expect($options[1]).toHaveValue('updatedAsc')
        expect($options[1]).not.toHaveAttribute('selected')

        expect($options[2]).toHaveTextContent('Form name (A to Z)')
        expect($options[2]).toHaveValue('titleAsc')
        expect($options[2]).not.toHaveAttribute('selected')

        expect($options[3]).toHaveTextContent('Form name (Z to A)')
        expect($options[3]).toHaveValue('titleDesc')
        expect($options[3]).not.toHaveAttribute('selected')
      })

      it('should render the sort button with correct attributes', () => {
        const $button = within($sorting).getByRole('button', {
          name: 'Sort forms'
        })

        expect($button).toBeInTheDocument()
        expect($button).toHaveAttribute('type', 'submit')
        expect($button).toHaveClass('govuk-button--secondary')
        expect($button).toHaveClass('app-field-group__button')
      })

      it('should not render hidden search input when no search title exists', () => {
        const hiddenInput = within($sorting).queryByRole('textbox', {
          hidden: true
        })
        expect(hiddenInput).not.toBeInTheDocument()
      })
    })

    describe('With search title', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            },
            search: {
              title: 'Test Form'
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render hidden search input with correct value', () => {
        const hiddenInput = within($sorting).getByDisplayValue('Test Form')
        expect(hiddenInput).toBeInTheDocument()
        expect(hiddenInput).toHaveAttribute('type', 'hidden')
        expect(hiddenInput).toHaveAttribute('name', 'title')
        expect(hiddenInput).toHaveAttribute('value', 'Test Form')
      })
    })

    describe('With different sort options selected', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'title',
              order: 'asc'
            },
            search: {}
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should select the correct sort option', () => {
        const $select = within($sorting).getByRole('combobox', {
          name: 'Sort by'
        })
        const $options = within($select).getAllByRole('option')

        expect($options[0]).not.toHaveAttribute('selected')
        expect($options[1]).not.toHaveAttribute('selected')
        expect($options[2]).toHaveAttribute('selected')
        expect($options[3]).not.toHaveAttribute('selected')
      })
    })

    describe('With invalid sorting data', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'invalidField',
              order: 'invalidOrder'
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should not select any sort option', () => {
        const $select = within($sorting).getByRole('combobox', {
          name: 'Sort by'
        })
        const $options = within($select).getAllByRole('option')

        expect($options).toHaveLength(4)
        $options.forEach(($option) => {
          expect($option).not.toHaveAttribute('selected')
        })
      })
    })

    describe('With empty sorting data', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {}
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render the sorting component', () => {
        expect($sorting).toBeInTheDocument()
      })

      it('should not select any sort option', () => {
        const $select = within($sorting).getByRole('combobox', {
          name: 'Sort by'
        })
        const $options = within($select).getAllByRole('option')

        expect($options).toHaveLength(4)
        $options.forEach(($option) => {
          expect($option).not.toHaveAttribute('selected')
        })
      })
    })

    describe('With author search parameter', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            },
            search: {
              author: 'Enrique Chase'
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render hidden author input with correct value', () => {
        const hiddenInput = within($sorting).getByDisplayValue('Enrique Chase')
        expect(hiddenInput).toBeInTheDocument()
        expect(hiddenInput).toHaveAttribute('type', 'hidden')
        expect(hiddenInput).toHaveAttribute('name', 'author')
      })
    })

    describe('With organisations search parameter', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            },
            search: {
              organisations: ['Defra', 'Environment Agency']
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render hidden organisation inputs for each value', () => {
        const orgInputs = within($sorting).getAllByDisplayValue(
          /(Defra|Environment Agency)/
        )
        expect(orgInputs).toHaveLength(2)
        orgInputs.forEach((input) => {
          expect(input).toHaveAttribute('type', 'hidden')
          expect(input).toHaveAttribute('name', 'organisations')
        })
      })
    })

    describe('With status search parameter', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            },
            search: {
              status: ['draft', 'live']
            }
          }
        })

        $sorting = container.getByRole('form', { name: 'Sorting options' })
      })

      it('should render hidden status inputs for each value', () => {
        const statusInputs =
          within($sorting).getAllByDisplayValue(/(draft|live)/)
        expect(statusInputs).toHaveLength(2)
        statusInputs.forEach((input) => {
          expect(input).toHaveAttribute('type', 'hidden')
          expect(input).toHaveAttribute('name', 'status')
        })
      })
    })
  })

  describe('Without sorting data', () => {
    it('should not render the sorting component', () => {
      const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
        params: {}
      })

      const $sortingNotFound = container.queryByRole('form', {
        name: 'Sort forms'
      })
      expect($sortingNotFound).not.toBeInTheDocument()
    })
  })
})
