import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import * as forms from '~/src/lib/forms.js'
import {
  editorViewModel,
  getFormSpecificNavigation,
  listViewModel,
  overviewViewModel
} from '~/src/models/forms/library.js'
import { formOverviewPath, formsLibraryPath } from '~/src/models/links.js'

describe('Forms Library Models', () => {
  const formSlug = 'test-form-slug'
  const formPath = formOverviewPath(formSlug)

  const draftAuthor = {
    id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc',
    displayName: 'Enrique Chase'
  }

  const liveAuthor = {
    id: 'e57d007c-4d5a-4c9f-8d8c-0890a3a16215',
    displayName: 'Amelia Smith'
  }

  const now = new Date()

  /**
   * @satisfies {FormMetadata}
   */
  const metadataWithDraft = {
    id: '661e4ca5039739ef2902b214',
    slug: formSlug,
    title: 'Test Form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: draftAuthor,
    updatedAt: now,
    updatedBy: draftAuthor,
    draft: {
      createdAt: now,
      createdBy: draftAuthor,
      updatedAt: now,
      updatedBy: draftAuthor
    },
    live: undefined
  }

  /**
   * @satisfies {FormMetadata}
   */
  const metadataWithLive = {
    id: '661e4ca5039739ef2902b214',
    slug: formSlug,
    title: 'Test Form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: liveAuthor,
    updatedAt: now,
    updatedBy: liveAuthor,
    draft: undefined,
    live: {
      createdAt: now,
      createdBy: liveAuthor,
      updatedAt: now,
      updatedBy: liveAuthor
    }
  }

  describe('getFormSpecificNavigation', () => {
    describe('with draft existing', () => {
      it('includes Editor link', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithDraft,
          'Overview'
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: true }),
          buildEntry('Editor', `${formPath}/editor`, { isActive: false })
        ])
      })

      it('shows Editor page as active when activePage is "Editor"', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithDraft,
          'Editor'
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: false }),
          buildEntry('Editor', `${formPath}/editor`, { isActive: true })
        ])
      })
    })

    describe('without draft', () => {
      it('does not include Editor link', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithLive,
          'Overview'
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: true })
        ])
      })

      it('excludes Editor link even when activePage is "Editor"', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithLive,
          'Editor'
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: false })
        ])
      })
    })

    describe('with invalid activePage', () => {
      it('shows no navigation item as active when activePage does not match any item', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithDraft,
          'NonExistingPage'
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: false }),
          buildEntry('Editor', `${formPath}/editor`, { isActive: false })
        ])
      })
    })

    describe('with default activePage', () => {
      it('shows no navigation item as active when activePage is defaulted', () => {
        const navigation = getFormSpecificNavigation(
          formPath,
          metadataWithDraft
        )

        expect(navigation).toEqual([
          buildEntry('Forms library', formsLibraryPath, { isActive: false }),
          buildEntry('Overview', formPath, { isActive: false }),
          buildEntry('Editor', `${formPath}/editor`, { isActive: false })
        ])
      })
    })
  })

  describe('overviewViewModel', () => {
    describe('with draft existing', () => {
      it('returns correct view model structure', () => {
        const notificationMessage = 'Form updated successfully'
        const viewModel = overviewViewModel(
          metadataWithDraft,
          notificationMessage
        )

        expect(viewModel).toMatchObject({
          navigation: getFormSpecificNavigation(
            formPath,
            metadataWithDraft,
            'Overview'
          ),
          backLink: {
            href: formsLibraryPath,
            text: 'Back to forms library'
          },
          pageHeading: {
            text: metadataWithDraft.title,
            size: 'large'
          },
          notification: notificationMessage,
          formManage: {
            action: `${formPath}/editor`,
            method: 'GET',
            buttons: [
              {
                text: 'Edit draft',
                classes: 'govuk-button--secondary-quiet'
              },
              {
                text: 'Make draft live',
                attributes: {
                  formaction: `${formPath}/make-draft-live`
                }
              }
            ],
            links: [
              {
                text: 'Delete draft',
                href: `${formPath}/delete-draft`
              }
            ]
          }
        })
      })
    })

    describe('without draft', () => {
      it('returns correct view model structure', () => {
        const notificationMessage = 'Form updated successfully'
        const viewModel = overviewViewModel(
          metadataWithLive,
          notificationMessage
        )

        expect(viewModel).toMatchObject({
          navigation: getFormSpecificNavigation(
            formPath,
            metadataWithLive,
            'Overview'
          ),
          backLink: {
            href: formsLibraryPath,
            text: 'Back to forms library'
          },
          pageHeading: {
            text: metadataWithLive.title,
            size: 'large'
          },
          notification: notificationMessage,
          formManage: {
            action: `${formPath}/create-draft-from-live`,
            method: 'POST',
            buttons: [
              {
                text: 'Create draft to edit'
              }
            ]
          }
        })
      })
    })
  })

  describe('editorViewModel', () => {
    it('returns correct view model structure', () => {
      const mockDefinition = {
        name: 'Test Form Definition',
        pages: [],
        conditions: [],
        sections: [],
        lists: []
      }

      const viewModel = editorViewModel(metadataWithDraft, mockDefinition)

      expect(viewModel).toMatchObject({
        navigation: getFormSpecificNavigation(
          formPath,
          metadataWithDraft,
          'Editor'
        ),
        formDefinition: mockDefinition,
        form: metadataWithDraft,
        backLink: {
          href: `/library/${formSlug}`,
          text: 'Back to form overview'
        }
      })
    })
  })

  describe('listViewModel', () => {
    const token = 'some-token'
    const paginationOptions = {
      page: 1,
      perPage: 10
    }

    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('when pagination data is available', () => {
      it('returns correct view model structure with pagination', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft, metadataWithLive],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 2,
              totalItems: 15
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)

        const viewModel = await listViewModel(token, paginationOptions)

        expect(viewModel).toMatchObject({
          pageTitle: 'Forms library',
          pageHeading: {
            text: 'Forms library'
          },
          pageDescription: {
            text: 'Create or search for a form.'
          },
          pageActions: expect.arrayContaining([
            expect.objectContaining({
              text: 'Create a new form'
            })
          ]),
          formItems: mockFormResponse.data,
          pagination: {
            page: 1,
            perPage: 10,
            totalPages: 2,
            totalItems: 15,
            pages: expect.any(Array)
          }
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: true
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10`,
            current: false
          }
        ])
      })
    })

    describe('when pagination data is not available', () => {
      it('returns correct view model structure without pagination', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {}
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)

        const viewModel = await listViewModel(token, paginationOptions)

        expect(viewModel).toMatchObject({
          pageTitle: 'Forms library',
          pageHeading: {
            text: 'Forms library'
          },
          pageDescription: {
            text: 'Create or search for a form.'
          },
          pageActions: expect.arrayContaining([
            expect.objectContaining({
              text: 'Create a new form'
            })
          ]),
          formItems: mockFormResponse.data,
          pagination: undefined
        })
      })
    })

    describe('when forms.list throws an error', () => {
      it('propagates the error', async () => {
        const errorMessage = 'Failed to fetch forms'
        jest.spyOn(forms, 'list').mockRejectedValue(new Error(errorMessage))

        await expect(listViewModel(token, paginationOptions)).rejects.toThrow(
          errorMessage
        )
      })
    })
  })

  describe('listViewModel pagination', () => {
    const token = 'some-token'

    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('when total pages are less than or equal to 5', () => {
      it('returns all pages without ellipsis', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 3,
              perPage: 10,
              totalPages: 5,
              totalItems: 50
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 3, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10`,
            current: false
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10`,
            current: true
          },
          {
            number: '4',
            href: `${formsLibraryPath}?page=4&perPage=10`,
            current: false
          },
          {
            number: '5',
            href: `${formsLibraryPath}?page=5&perPage=10`,
            current: false
          }
        ])
      })
    })

    describe('when total pages are greater than 5', () => {
      it('adds ellipsis appropriately', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 5,
              perPage: 10,
              totalPages: 10,
              totalItems: 100
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 5, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: false
          },
          { ellipsis: true },
          {
            number: '4',
            href: `${formsLibraryPath}?page=4&perPage=10`,
            current: false
          },
          {
            number: '5',
            href: `${formsLibraryPath}?page=5&perPage=10`,
            current: true
          },
          {
            number: '6',
            href: `${formsLibraryPath}?page=6&perPage=10`,
            current: false
          },
          { ellipsis: true },
          {
            number: '10',
            href: `${formsLibraryPath}?page=10&perPage=10`,
            current: false
          }
        ])
      })
    })

    describe('when current page is the first page', () => {
      it('does not add ellipsis at the beginning', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 10,
              totalItems: 100
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 1, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: true
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10`,
            current: false
          },
          { ellipsis: true },
          {
            number: '10',
            href: `${formsLibraryPath}?page=10&perPage=10`,
            current: false
          }
        ])
      })
    })

    describe('when current page is the last page', () => {
      it('does not add ellipsis at the end', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 10,
              perPage: 10,
              totalPages: 10,
              totalItems: 100
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 10, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: false
          },
          { ellipsis: true },
          {
            number: '9',
            href: `${formsLibraryPath}?page=9&perPage=10`,
            current: false
          },
          {
            number: '10',
            href: `${formsLibraryPath}?page=10&perPage=10`,
            current: true
          }
        ])
      })
    })

    describe('when total pages is less than 1', () => {
      it('returns only the first page', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 1,
              totalItems: 0
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 1, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: true
          }
        ])
      })
    })

    describe('when perPage is different', () => {
      it('includes perPage in hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 5,
              totalPages: 3,
              totalItems: 15
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 2, perPage: 5 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=5`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=5`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=5`,
            current: false
          }
        ])
      })
    })

    describe('when sorting options are provided', () => {
      it('includes sort parameters in hrefs for updatedAt sorting', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            sorting: {
              sortBy: 'updatedAt',
              order: 'desc'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 2, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&sort=updatedDesc`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&sort=updatedDesc`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&sort=updatedDesc`,
            current: false
          }
        ])
      })

      it('includes sort parameters in hrefs for title sorting', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            sorting: {
              sortBy: 'title',
              order: 'asc'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 2, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&sort=titleAsc`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&sort=titleAsc`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&sort=titleAsc`,
            current: false
          }
        ])
      })

      it('does not include sort parameters when only sortBy is provided', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            sorting: {
              sortBy: 'title'
              // order is missing
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 2, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10`,
            current: false
          }
        ])
      })

      it('does not include sort parameters when only order is provided', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            sorting: {
              // sortBy is missing
              order: 'desc'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel(token, { page: 2, perPage: 10 })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10`,
            current: false
          }
        ])
      })
    })

    describe('when search options are provided', () => {
      it('includes title search parameters in pagination hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            search: {
              title: 'some search'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel('token', {
          page: 2,
          perPage: 10,
          title: 'some search'
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&title=some+search`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&title=some+search`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&title=some+search`,
            current: false
          }
        ])
      })

      it('includes title search parameters with sorting in pagination hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            sorting: {
              sortBy: 'title',
              order: 'asc'
            },
            search: {
              title: 'some search'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel('token', {
          page: 2,
          perPage: 10,
          sortBy: 'title',
          order: 'asc',
          title: 'some search'
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&sort=titleAsc&title=some+search`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&sort=titleAsc&title=some+search`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&sort=titleAsc&title=some+search`,
            current: false
          }
        ])
      })

      it('includes author search parameter in pagination hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            search: {
              author: 'Enrique Chase'
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel('token', {
          page: 2,
          perPage: 10,
          author: 'Enrique Chase'
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&author=Enrique+Chase`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&author=Enrique+Chase`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&author=Enrique+Chase`,
            current: false
          }
        ])
      })

      it('includes multiple organisations in pagination hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            search: {
              organisations: ['Defra', 'EA']
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel('token', {
          page: 2,
          perPage: 10,
          organisations: ['Defra', 'EA']
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&organisations=Defra&organisations=EA`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&organisations=Defra&organisations=EA`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&organisations=Defra&organisations=EA`,
            current: false
          }
        ])
      })

      it('includes multiple status values in pagination hrefs', async () => {
        const mockFormResponse = {
          data: [metadataWithDraft],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 30
            },
            search: {
              status: /** @type {FormStatus[]} */ (['draft', 'live'])
            }
          }
        }

        jest.spyOn(forms, 'list').mockResolvedValue(mockFormResponse)
        const viewModel = await listViewModel('token', {
          page: 2,
          perPage: 10,
          status: ['draft', 'live']
        })

        expect(viewModel.pagination).toBeTruthy()
        expect(viewModel.pagination?.pages).toEqual([
          {
            number: '1',
            href: `${formsLibraryPath}?page=1&perPage=10&status=draft&status=live`,
            current: false
          },
          {
            number: '2',
            href: `${formsLibraryPath}?page=2&perPage=10&status=draft&status=live`,
            current: true
          },
          {
            number: '3',
            href: `${formsLibraryPath}?page=3&perPage=10&status=draft&status=live`,
            current: false
          }
        ])
      })
    })
  })
})

/**
 * @import { FormMetadata, FormStatus } from '@defra/forms-model'
 */
