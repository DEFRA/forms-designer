import { buildEntry } from '~/src/common/nunjucks/context/build-navigation.js'
import {
  editorViewModel,
  getFormSpecificNavigation,
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
      test('includes Editor link', () => {
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

      test('Editor page is active when activePage is "Editor"', () => {
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
      test('does not include Editor link', () => {
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

      test('Editor link is not included even when activePage is "Editor"', () => {
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
      test('no navigation item is active when activePage does not match any item', () => {
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
      test('no navigation item is active when activePage is defaulted', () => {
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
      test('returns correct view model structure', () => {
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
            ]
          }
        })
      })
    })

    describe('without draft', () => {
      test('returns correct view model structure', () => {
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
    test('returns correct view model structure', () => {
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
})

/**
 * @import { FormMetadata } from '@defra/forms-model'
 */
