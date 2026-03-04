import { Roles } from '@defra/forms-model'

import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getUsers } from '~/src/lib/manage.js'
import { auth, authFormCreator } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/config.ts')
jest.mock('~/src/lib/manage.js')
jest.mock('~/src/lib/forms.js')

const userList = [
  {
    userId: 'id1',
    displayName: 'John Smith',
    email: 'john.smith@here.com',
    roles: [Roles.Admin],
    scopes: []
  },
  {
    userId: 'id2',
    displayName: 'Peter Jones',
    email: 'peter.jones@email.com',
    roles: [Roles.FormCreator],
    scopes: []
  }
]

const now = new Date()
const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
const authorDisplayName = 'Enrique Chase'

/**
 * @satisfies {FormMetadataAuthor}
 */
const author = {
  id: authorId,
  displayName: authorDisplayName
}

/**
 * @satisfies {FormMetadata}
 */
const formMetadataDraft = {
  id: '661e4ca5039739ef2902b214',
  slug: 'my-form-slug',
  title: 'Test form',
  organisation: 'Defra',
  teamName: 'Defra Forms',
  teamEmail: 'defraforms@defra.gov.uk',
  notificationEmail: 'notificationemail@defra.gov.uk',
  createdAt: now,
  createdBy: author,
  updatedAt: now,
  updatedBy: author
}

/**
 * @satisfies {FormMetadata}
 */
const formMetadataLive = {
  id: '661e4ca5039739ef2902b214',
  slug: 'my-form-slug',
  title: 'Test form',
  organisation: 'Defra',
  teamName: 'Defra Forms',
  teamEmail: 'defraforms@defra.gov.uk',
  notificationEmail: 'notificationemail@defra.gov.uk',
  createdAt: now,
  createdBy: author,
  updatedAt: now,
  updatedBy: author,
  live: {
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }
}

describe('Route helpers', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getUsers).mockResolvedValueOnce(userList)
    jest.mocked(config).featureFlagUseEntitlementApi = true
  })

  describe('checkUserManagementAccess', () => {
    test('should throw if entitlement api not enabled', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = false

      const options = {
        method: 'get',
        url: '/manage/users',
        auth
      }

      const { container } = await renderResponse(server, options)
      const $mainHeading = container.getByRole('heading', { level: 1 })
      expect($mainHeading).toHaveTextContent(
        'You do not have access to this service'
      )
    })

    test('should render page ok', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = true

      const options = {
        method: 'get',
        url: '/manage/users',
        auth
      }

      const { container } = await renderResponse(server, options)
      const $mainHeading = container.getByRole('heading', { level: 1 })
      expect($mainHeading).toHaveTextContent('Manage users')
    })
  })

  describe('protectMetadataEditOfLiveForm', () => {
    test('should throw if form live but not publish permission', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = false
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadataLive)

      const options = {
        method: 'get',
        url: '/library/my-form/make-draft-live',
        auth: authFormCreator
      }

      const { container } = await renderResponse(server, options)
      const $mainHeading = container.getByRole('heading', { level: 1 })
      expect($mainHeading).toHaveTextContent('You cannot publish a form')
    })

    test('should throw if form live and trying to edit metadata', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = false
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadataLive)

      const options = {
        method: 'post',
        url: '/library/my-form/edit/privacy-notice',
        auth: authFormCreator,
        payload: {
          privacyNoticeType: 'link',
          privacyNoticeUrl: 'https://www.gov.uk/help/privacy-notice1'
        }
      }

      const { container } = await renderResponse(server, options)
      const $mainHeading = container.getByRole('heading', { level: 1 })
      expect($mainHeading).toHaveTextContent('You cannot change these answers')
    })

    test('should allow if form draft and trying to edit metadata', async () => {
      jest.mocked(config).featureFlagUseEntitlementApi = false
      jest
        .mocked(forms.get)
        .mockResolvedValueOnce(formMetadataDraft)
        .mockResolvedValueOnce(formMetadataDraft)

      const options = {
        method: 'post',
        url: '/library/my-form/edit/privacy-notice',
        auth: authFormCreator,
        payload: {
          privacyNoticeType: 'link',
          privacyNoticeUrl: 'https://www.gov.uk/help/privacy-notice1'
        }
      }

      const { response } = await renderResponse(server, options)
      expect(response.headers.location).toBe('/library/my-form')
    })
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
