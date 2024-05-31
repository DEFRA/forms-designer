import { beforeEach, describe, expect, test } from '@jest/globals'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Grid layout component', () => {
  /** @type {NodeListOf<HTMLElement>} */
  let $rows

  /** @type {NodeListOf<HTMLElement>} */
  let $columns

  describe('With child content', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          callBlock:
            '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML(
        '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })

  describe('With text param', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: {
            text: 'Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.'
          }
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toHaveTextContent(
        'Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.'
      )
    })
  })

  describe('With html param', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: {
            html: '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
          }
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML(
        '<p class="govuk-body">Used digger, digs great and is lots of fun to dig huge holes with. Comes with heater, comfy seat and radio.</p>'
      )
    })
  })

  describe('With attributes param', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: {
            attributes: {
              'data-example1': 'value1',
              'data-example2': 'value2',
              'data-example3': 'value3'
            }
          }
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected attributes', () => {
      expect($columns[0]).toHaveAttribute('data-example1', 'value1')
      expect($columns[0]).toHaveAttribute('data-example2', 'value2')
      expect($columns[0]).toHaveAttribute('data-example3', 'value3')
    })
  })

  describe('With multiple rows', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: [
            {
              text: 'Row 1, Column 1'
            },
            {
              text: 'Row 2, Column 1'
            }
          ]
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render 2 rows', () => {
      expect($rows).toHaveLength(2)
    })

    test('Should render 1 column per row', () => {
      expect($columns).toHaveLength(2)

      expect($rows[0]).toContainElement($columns[0])
      expect($rows[1]).toContainElement($columns[1])
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML('Row 1, Column 1')
      expect($columns[1]).toContainHTML('Row 2, Column 1')
    })
  })

  describe('With multiple rows (with attributes)', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: [
            {
              text: 'Row 1, Column 1',
              attributes: {
                'data-row1': 'column1'
              }
            },
            {
              text: 'Row 2, Column 1',
              attributes: {
                'data-row2': 'column1'
              }
            }
          ]
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected attributes', () => {
      expect($columns[0]).toHaveAttribute('data-row1', 'column1')
      expect($columns[1]).toHaveAttribute('data-row2', 'column1')
    })
  })

  describe('With multiple rows and columns', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: [
            [
              {
                text: 'Row 1, Column 1'
              },
              {
                text: 'Row 1, Column 2'
              }
            ],
            [
              {
                text: 'Row 2, Column 1'
              },
              {
                text: 'Row 2, Column 2'
              }
            ]
          ]
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render 2 rows', () => {
      expect($rows).toHaveLength(2)
    })

    test('Should render 2 columns per row', () => {
      expect($columns).toHaveLength(4)

      expect($rows[0]).toContainElement($columns[0])
      expect($rows[0]).toContainElement($columns[1])
      expect($rows[1]).toContainElement($columns[2])
      expect($rows[1]).toContainElement($columns[3])
    })

    test('Should render expected contents', () => {
      expect($columns[0]).toContainHTML('Row 1, Column 1')
      expect($columns[1]).toContainHTML('Row 1, Column 2')
      expect($columns[2]).toContainHTML('Row 2, Column 1')
      expect($columns[3]).toContainHTML('Row 2, Column 2')
    })
  })

  describe('With multiple rows and columns (with attributes)', () => {
    beforeEach(() => {
      const { document } = renderMacro(
        'appGridLayout',
        'grid-layout/macro.njk',
        {
          params: [
            [
              {
                text: 'Row 1, Column 1',
                attributes: {
                  'data-row1': 'column1'
                }
              },
              {
                text: 'Row 1, Column 2',
                attributes: {
                  'data-row1': 'column2'
                }
              }
            ],
            [
              {
                text: 'Row 2, Column 1',
                attributes: {
                  'data-row2': 'column1'
                }
              },
              {
                text: 'Row 2, Column 2',
                attributes: {
                  'data-row2': 'column2'
                }
              }
            ]
          ]
        }
      )

      $rows = document.querySelectorAll('.govuk-grid-row')
      $columns = document.querySelectorAll("[class^='govuk-grid-column']")
    })

    test('Should render expected attributes', () => {
      expect($columns[0]).toHaveAttribute('data-row1', 'column1')
      expect($columns[1]).toHaveAttribute('data-row1', 'column2')
      expect($columns[2]).toHaveAttribute('data-row2', 'column1')
      expect($columns[3]).toHaveAttribute('data-row2', 'column2')
    })
  })
})
