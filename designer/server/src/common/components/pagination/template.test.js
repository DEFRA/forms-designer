import { renderMacro } from '~/test/helpers/component-helpers.js'

describe('Pagination Component', () => {
  /** @type {Element | null} */
  let $pagination = null

  describe('With pagination data', () => {
    describe('Standard pagination', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should render the pagination component', () => {
        expect($pagination).toBeInTheDocument()
      })

      it('should have the correct previous and next links', () => {
        const $previousLink = $pagination?.querySelector(
          '.govuk-pagination__prev a'
        )
        const $nextLink = $pagination?.querySelector(
          '.govuk-pagination__next a'
        )

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
        const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
        expect($pages).toHaveLength(5)

        expect($pages?.[0].textContent?.trim()).toBe('1')
        expect($pages?.[0].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[1].textContent?.trim()).toBe('2')
        expect($pages?.[1].classList).toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[2].textContent?.trim()).toBe('3')
        expect($pages?.[2].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[3].textContent?.trim()).toBe('⋯') // horizontal ellipsis!
        expect($pages?.[3].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[4].textContent?.trim()).toBe('5')
        expect($pages?.[4].classList).not.toContain(
          'govuk-pagination__item--current'
        )
      })
    })

    describe('When on the first page', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render the previous link', () => {
        const $previousLink = $pagination?.querySelector(
          '.govuk-pagination__prev a'
        )
        expect($previousLink).toBeNull()
      })

      it('should render the next link', () => {
        const $nextLink = $pagination?.querySelector(
          '.govuk-pagination__next a'
        )
        expect($nextLink).toBeInTheDocument()
        expect($nextLink).toHaveAttribute('href', '/library?page=2&perPage=10')
        expect($nextLink).toHaveTextContent('Next')
      })
    })

    describe('When on the last page', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render the next link', () => {
        const $nextLink = $pagination?.querySelector(
          '.govuk-pagination__next a'
        )
        expect($nextLink).toBeNull()
      })

      it('should render the previous link', () => {
        const $previousLink = $pagination?.querySelector(
          '.govuk-pagination__prev a'
        )
        expect($previousLink).toBeInTheDocument()
        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=4&perPage=10'
        )
        expect($previousLink).toHaveTextContent('Previous')
      })

      it('should highlight the current page', () => {
        const $currentPage = $pagination?.querySelector(
          '.govuk-pagination__item--current'
        )
        expect($currentPage).toBeInTheDocument()
        expect($currentPage?.textContent?.trim()).toBe('5')
      })
    })

    describe('When total pages are fewer than the ellipsis threshold', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should display all page numbers without ellipsis', () => {
        const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
        expect($pages).toHaveLength(3)

        expect($pages?.[0].textContent?.trim()).toBe('1')
        expect($pages?.[0].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[1].textContent?.trim()).toBe('2')
        expect($pages?.[1].classList).toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[2].textContent?.trim()).toBe('3')
        expect($pages?.[2].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        const $ellipsis = $pagination?.querySelector(
          '.govuk-pagination__item--ellipses'
        )
        expect($ellipsis).toBeNull()
      })
    })

    describe('With different perPage values', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should generate correct href attributes with perPage parameter', () => {
        const $pages = $pagination?.querySelectorAll(
          '.govuk-pagination__item a'
        )
        expect($pages).toHaveLength(4)

        expect($pages?.[0]).toHaveAttribute('href', '/library?page=1&perPage=5')
        expect($pages?.[1]).toHaveAttribute('href', '/library?page=2&perPage=5')
        expect($pages?.[2]).toHaveAttribute('href', '/library?page=3&perPage=5')
        expect($pages?.[3]).toHaveAttribute('href', '/library?page=4&perPage=5')
      })
    })

    describe('When there is only one page', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render the pagination component', () => {
        expect($pagination).toBeNull()
      })
    })

    describe('When current page exceeds total pages', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should render the pagination component', () => {
        expect($pagination).toBeInTheDocument()
      })

      it('should not highlight any page as current', () => {
        const $currentPage = $pagination?.querySelector(
          '.govuk-pagination__item--current'
        )
        expect($currentPage).toBeNull()
      })

      it('should render the correct previous and next links', () => {
        const $previousLink = $pagination?.querySelector(
          '.govuk-pagination__prev a'
        )
        const $nextLink = $pagination?.querySelector(
          '.govuk-pagination__next a'
        )

        expect($previousLink).toBeInTheDocument()
        expect($previousLink).toHaveAttribute(
          'href',
          '/library?page=5&perPage=10'
        )
        expect($previousLink).toHaveTextContent('Previous')

        expect($nextLink).toBeNull()
      })

      it('should render the correct page numbers', () => {
        const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
        expect($pages).toHaveLength(5)

        expect($pages?.[0].textContent?.trim()).toBe('1')
        expect($pages?.[0].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[1].textContent?.trim()).toBe('2')
        expect($pages?.[1].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[2].textContent?.trim()).toBe('3')
        expect($pages?.[2].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[3].textContent?.trim()).toBe('⋯') // Horizontal ellipsis!
        expect($pages?.[3].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[4].textContent?.trim()).toBe('5')
        expect($pages?.[4].classList).not.toContain(
          'govuk-pagination__item--current'
        )
      })
    })

    describe('When totalPages is zero', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
          params: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 0,
              totalItems: 0,
              pages: []
            }
          }
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render the pagination component', () => {
        expect($pagination).toBeNull()
      })
    })

    describe('When baseUrl is missing', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should generate hrefs without baseUrl', () => {
        const $nextLink = $pagination?.querySelector(
          '.govuk-pagination__next a'
        )
        expect($nextLink).toHaveAttribute('href', '?page=3&perPage=10')
      })
    })

    describe('When pagination parameter is missing', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
          params: {
            baseUrl: '/library'
          }
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render the pagination component', () => {
        expect($pagination).toBeNull()
      })
    })

    describe('When pages array is empty', () => {
      beforeEach(() => {
        renderMacro('appPagination', 'pagination/macro.njk', {
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
        })

        $pagination = document.querySelector('.govuk-pagination')
      })

      it('should not render page number items', () => {
        const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
        expect($pages?.length).toBe(0)
      })
    })
  })

  describe('Without pagination data', () => {
    beforeEach(() => {
      renderMacro('appPagination', 'pagination/macro.njk', {
        params: {}
      })

      $pagination = document.querySelector('.govuk-pagination')
    })

    it('should not render the pagination component', () => {
      expect($pagination).toBeNull()
    })
  })
})
