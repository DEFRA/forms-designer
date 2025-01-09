import { within } from '@testing-library/dom'

import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pagination Component', () => {
  /** @type {HTMLElement} */
  let $pagination

  describe('With pagination data', () => {
    describe('Standard pagination', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 2,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: false
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10',
                    current: true
                  },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=10',
                    current: false
                  },
                  { ellipsis: true },
                  {
                    number: '5',
                    href: '/library?page=5&perPage=10',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should render the pagination component', () => {
        expect($pagination).toBeInTheDocument()
      })

      it('should have the correct previous and next links', () => {
        const $previousLink = within($pagination).getByRole('link', {
          name: 'Previous'
        })
        const $nextLink = within($pagination).getByRole('link', {
          name: 'Next'
        })

        expect($previousLink).toBeInTheDocument()
        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=1&perPage=10'
        )
        expect($previousLink).toHaveTextContent('Previous')

        expect($nextLink).toBeInTheDocument()
        expect($nextLink).toHaveAttribute('href', '/library?page=3&perPage=10')
        expect($nextLink).toHaveTextContent('Next')
      })

      it('should render the correct page numbers', () => {
        const $pages = within($pagination).getAllByRole('listitem')
        expect($pages).toHaveLength(5)

        const $page1Link = within($pages[0]).getByRole('link', {
          name: 'Page 1'
        })
        expect($page1Link).toHaveTextContent('1')
        expect($pages[0]).not.toHaveClass('govuk-pagination__item--current')

        const $page2Link = within($pages[1]).getByRole('link', {
          name: 'Page 2'
        })
        expect($page2Link).toHaveTextContent('2')
        expect($pages[1]).toHaveClass('govuk-pagination__item--current')

        const $page3Link = within($pages[2]).getByRole('link', {
          name: 'Page 3'
        })
        expect($page3Link).toHaveTextContent('3')
        expect($pages[2]).not.toHaveClass('govuk-pagination__item--current')

        expect($pages[3]).toHaveTextContent('⋯') // Horizontal ellipsis!
        expect($pages[3]).not.toHaveClass('govuk-pagination__item--current')

        const $page5Link = within($pages[4]).getByRole('link', {
          name: 'Page 5'
        })
        expect($page5Link).toHaveTextContent('5')
        expect($pages[4]).not.toHaveClass('govuk-pagination__item--current')
      })
    })

    describe('When on the first page', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 1,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: true
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should not render the previous link', () => {
        const $previousLink = within($pagination).queryByRole('link', {
          name: 'Previous'
        })
        expect($previousLink).not.toBeInTheDocument()
      })

      it('should render the next link', () => {
        const $nextLink = within($pagination).getByRole('link', {
          name: 'Next'
        })
        expect($nextLink).toBeInTheDocument()
        expect($nextLink).toHaveAttribute('href', '/library?page=2&perPage=10')
        expect($nextLink).toHaveTextContent('Next')
      })
    })

    describe('When on the last page', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 5,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: false
                  },
                  { ellipsis: true },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=10',
                    current: false
                  },
                  {
                    number: '4',
                    href: '/library?page=4&perPage=10',
                    current: false
                  },
                  {
                    number: '5',
                    href: '/library?page=5&perPage=10',
                    current: true
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should not render the next link', () => {
        const $nextLink = within($pagination).queryByRole('link', {
          name: 'Next'
        })
        expect($nextLink).not.toBeInTheDocument()
      })

      it('should render the previous link', () => {
        const $previousLink = within($pagination).getByRole('link', {
          name: 'Previous'
        })
        expect($previousLink).toBeInTheDocument()
        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=4&perPage=10'
        )
        expect($previousLink).toHaveTextContent('Previous')
      })

      it('should highlight the current page', () => {
        const $currentPageLink = within($pagination).getByText('5', {
          selector: 'a'
        })
        const $currentPageItem = $currentPageLink.closest('li')

        expect($currentPageItem).toBeInTheDocument()
        expect($currentPageItem).toHaveClass('govuk-pagination__item--current')
      })
    })

    describe('When total pages are fewer than the ellipsis threshold', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 2,
                perPage: 10,
                totalPages: 3,
                totalItems: 30,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: false
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10',
                    current: true
                  },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=10',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should display all page numbers without ellipsis', () => {
        const $pages = within($pagination).getAllByRole('listitem')
        expect($pages).toHaveLength(3)

        const $page1Link = within($pages[0]).getByRole('link')
        expect($page1Link).toHaveTextContent('1')
        expect($pages[0]).not.toHaveClass('govuk-pagination__item--current')

        const $page2Link = within($pages[1]).getByRole('link')
        expect($page2Link).toHaveTextContent('2')
        expect($pages[1]).toHaveClass('govuk-pagination__item--current')

        const $page3Link = within($pages[2]).getByRole('link')
        expect($page3Link).toHaveTextContent('3')
        expect($pages[2]).not.toHaveClass('govuk-pagination__item--current')

        const $ellipsis = $pagination.querySelector(
          '.govuk-pagination__item--ellipses'
        )
        expect($ellipsis).not.toBeInTheDocument()
      })
    })

    describe('With different perPage values', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 2,
                perPage: 5,
                totalPages: 4,
                totalItems: 20,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=5',
                    current: false
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=5',
                    current: true
                  },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=5',
                    current: false
                  },
                  {
                    number: '4',
                    href: '/library?page=4&perPage=5',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should generate correct href attributes with perPage parameter', () => {
        const $pageLinks = within($pagination).getAllByRole('link', {
          name: /Page \d+/
        })
        expect($pageLinks).toHaveLength(4)

        expect($pageLinks[0]).toHaveAttribute(
          'href',
          '/library?page=1&perPage=5'
        )
        expect($pageLinks[1]).toHaveAttribute(
          'href',
          '/library?page=2&perPage=5'
        )
        expect($pageLinks[2]).toHaveAttribute(
          'href',
          '/library?page=3&perPage=5'
        )
        expect($pageLinks[3]).toHaveAttribute(
          'href',
          '/library?page=4&perPage=5'
        )
      })
    })

    describe('When there is only one page', () => {
      it('should not render the pagination component', () => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              pagination: {
                page: 1,
                perPage: 10,
                totalPages: 1,
                totalItems: 5,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: true
                  }
                ]
              }
            }
          }
        )

        const $paginationNotFound = container.queryByRole('navigation', {
          name: 'Pagination'
        })

        expect($paginationNotFound).not.toBeInTheDocument()
      })
    })

    describe('When current page exceeds total pages', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 6,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10',
                    current: false
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10',
                    current: false
                  },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=10',
                    current: false
                  },
                  { ellipsis: true },
                  {
                    number: '5',
                    href: '/library?page=5&perPage=10',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should render the pagination component', () => {
        expect($pagination).toBeInTheDocument()
      })

      it('should not highlight any page as current', () => {
        const $pages = within($pagination).getAllByRole('listitem')

        $pages.forEach(($page) => {
          expect($page).not.toHaveClass('govuk-pagination__item--current')
        })
      })

      it('should render the correct previous and next links', () => {
        const $previousLink = within($pagination).getByRole('link', {
          name: 'Previous'
        })
        expect($previousLink).toBeInTheDocument()
        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=5&perPage=10'
        )
        expect($previousLink).toHaveTextContent('Previous')

        const $nextLink = within($pagination).queryByRole('link', {
          name: 'Next'
        })
        expect($nextLink).not.toBeInTheDocument()
      })

      it('should render the correct page numbers', () => {
        const $pages = within($pagination).getAllByRole('listitem')
        expect($pages).toHaveLength(5)

        const $page1Link = within($pages[0]).getByRole('link', {
          name: 'Page 1'
        })
        expect($page1Link).toHaveTextContent('1')
        expect($pages[0]).not.toHaveClass('govuk-pagination__item--current')

        const $page2Link = within($pages[1]).getByRole('link', {
          name: 'Page 2'
        })
        expect($page2Link).toHaveTextContent('2')
        expect($pages[1]).not.toHaveClass('govuk-pagination__item--current')

        const $page3Link = within($pages[2]).getByRole('link', {
          name: 'Page 3'
        })
        expect($page3Link).toHaveTextContent('3')
        expect($pages[2]).not.toHaveClass('govuk-pagination__item--current')

        expect($pages[3]).toHaveTextContent('⋯') // Horizontal ellipsis!
        expect($pages[3]).not.toHaveClass('govuk-pagination__item--current')

        const $page5Link = within($pages[4]).getByRole('link', {
          name: 'Page 5'
        })
        expect($page5Link).toHaveTextContent('5')
        expect($pages[4]).not.toHaveClass('govuk-pagination__item--current')
      })
    })

    describe('When totalPages is zero', () => {
      it('should not render the pagination component', () => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              pagination: {
                page: 1,
                perPage: 10,
                totalPages: 0,
                totalItems: 0,
                pages: []
              }
            }
          }
        )

        const $paginationNotFound = container.queryByRole('navigation', {
          name: 'Pagination'
        })

        expect($paginationNotFound).not.toBeInTheDocument()
      })
    })

    describe('When baseUrl is missing', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              pagination: {
                page: 2,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '?page=1&perPage=10',
                    current: false
                  },
                  {
                    number: '2',
                    href: '?page=2&perPage=10',
                    current: true
                  },
                  {
                    number: '3',
                    href: '?page=3&perPage=10',
                    current: false
                  },
                  { ellipsis: true },
                  {
                    number: '5',
                    href: '?page=5&perPage=10',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should generate hrefs without baseUrl', () => {
        const $nextLink = within($pagination).getByRole('link', {
          name: 'Next'
        })
        expect($nextLink).toHaveAttribute('href', '?page=3&perPage=10')
      })
    })

    describe('When pagination parameter is missing', () => {
      it('should not render the pagination component', () => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library'
            }
          }
        )

        const $paginationNotFound = container.queryByRole('navigation', {
          name: 'Pagination'
        })

        expect($paginationNotFound).not.toBeInTheDocument()
      })
    })

    describe('When pages array is empty', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              pagination: {
                page: 1,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: []
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should not render page number items', () => {
        const $pages = within($pagination).queryAllByRole('listitem')
        expect($pages).toHaveLength(0)
      })
    })

    describe('With search title parameter', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              search: {
                title: 'Test Title'
              },
              pagination: {
                page: 2,
                perPage: 10,
                totalPages: 5,
                totalItems: 50,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10&title=Test%20Title',
                    current: false
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10&title=Test%20Title',
                    current: true
                  },
                  {
                    number: '3',
                    href: '/library?page=3&perPage=10&title=Test%20Title',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should include encoded title parameter in navigation links', () => {
        const $previousLink = within($pagination).getByRole('link', {
          name: 'Previous'
        })
        const $nextLink = within($pagination).getByRole('link', {
          name: 'Next'
        })

        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=1&perPage=10&title=Test%20Title'
        )
        expect($nextLink).toHaveAttribute(
          'href',
          '/library?page=3&perPage=10&title=Test%20Title'
        )
      })

      it('should include encoded title parameter in page number links', () => {
        const $pageLinks = within($pagination).getAllByRole('link', {
          name: /Page \d+/
        })

        expect($pageLinks[0]).toHaveAttribute(
          'href',
          '/library?page=1&perPage=10&title=Test%20Title'
        )
        expect($pageLinks[1]).toHaveAttribute(
          'href',
          '/library?page=2&perPage=10&title=Test%20Title'
        )
        expect($pageLinks[2]).toHaveAttribute(
          'href',
          '/library?page=3&perPage=10&title=Test%20Title'
        )
      })
    })

    describe('With special characters in search title', () => {
      beforeEach(() => {
        const { container } = renderMacro(
          'appPagination',
          'pagination/macro.njk',
          {
            params: {
              baseUrl: '/library',
              search: {
                title: 'Test & Special?'
              },
              pagination: {
                page: 1,
                perPage: 10,
                totalPages: 2,
                totalItems: 15,
                pages: [
                  {
                    number: '1',
                    href: '/library?page=1&perPage=10&title=Test%20%26%20Special%3F',
                    current: true
                  },
                  {
                    number: '2',
                    href: '/library?page=2&perPage=10&title=Test%20%26%20Special%3F',
                    current: false
                  }
                ]
              }
            }
          }
        )

        $pagination = container.getByRole('navigation', { name: 'Pagination' })
      })

      it('should properly encode special characters in title parameter', () => {
        const $nextLink = within($pagination).getByRole('link', {
          name: 'Next'
        })

        expect($nextLink).toHaveAttribute(
          'href',
          '/library?page=2&perPage=10&title=Test%20%26%20Special%3F'
        )
      })
    })
  })

  describe('Without pagination data', () => {
    it('should not render the pagination component', () => {
      const { container } = renderMacro(
        'appPagination',
        'pagination/macro.njk',
        {
          params: {}
        }
      )

      const $paginationNotFound = container.queryByRole('navigation', {
        name: 'Pagination'
      })

      expect($paginationNotFound).not.toBeInTheDocument()
    })
  })
})
