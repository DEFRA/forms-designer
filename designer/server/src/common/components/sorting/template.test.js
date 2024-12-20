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
    })

    describe('With different sort options selected', () => {
      beforeEach(() => {
        const { container } = renderMacro('appSorting', 'sorting/macro.njk', {
          params: {
            sorting: {
              sortBy: 'title',
              order: 'asc'
            }
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
