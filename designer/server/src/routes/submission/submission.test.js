import {
  ComponentType,
  ControllerType,
  Engine,
  FormStatus
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import {
  getFormDefinitionVersion,
  getLiveFormDefinition
} from '~/src/lib/forms.js'
import { getSubmissionRecord } from '~/src/services/formSubmissionService.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/services/formSubmissionService.js')

/** @type {FormSubmissionDocument} */
const submissionRecord = {
  meta: {
    schemaVersion: 1,
    timestamp: new Date('2026-03-17T13:35:33.712Z'),
    referenceNumber: '88J-TKL-AU8',
    formName: 'First form',
    formId: '6996f3b9c18253384380d07a',
    formSlug: 'first-form',
    status: FormStatus.Draft,
    isPreview: true,
    notificationEmail: 'enrique.chase@defra.gov.uk',
    versionMetadata: {
      versionNumber: 1,
      createdAt: new Date('2026-03-16T13:17:39.631Z')
    }
  },
  data: {
    main: {
      DzDkCy: [
        {
          type: 'Feature',
          properties: {
            description: 'Point',
            coordinateGridReference: 'SK 14746 71169',
            centroidGridReference: 'SK 14746 71169'
          },
          geometry: {
            type: 'Point',
            coordinates: [-1.7805093, 53.2373552]
          },
          id: 'b6d9c3dc-4f8a-4277-9b00-5cc83ada683a'
        },
        {
          id: 'df2f4015-d72d-46d9-93fc-1adc4062181b',
          type: 'Feature',
          properties: {
            description: 'Shape',
            coordinateGridReference: 'SK 14796 71199',
            centroidGridReference: 'SK 14784 71213'
          },
          geometry: {
            coordinates: [
              [
                [-1.7797615, 53.2376203],
                [-1.7797469, 53.2378158],
                [-1.7803278, 53.2378158],
                [-1.7797615, 53.2376203]
              ]
            ],
            type: 'Polygon'
          }
        },
        {
          id: '9a36acc9-67c0-465f-8ad5-2cfd66a29771',
          type: 'Feature',
          properties: {
            description: 'Line',
            coordinateGridReference: 'SK 14815 71199',
            centroidGridReference: 'SK 14824 71212'
          },
          geometry: {
            coordinates: [
              [-1.7794783, 53.2376246],
              [-1.7790935, 53.237768],
              [-1.7794783, 53.2378115]
            ],
            type: 'LineString'
          }
        }
      ]
    },
    repeaters: {
      gAZbPt: [
        {
          rXmTGb: [
            {
              type: 'Feature',
              properties: {
                description: 'Egg',
                coordinateGridReference: 'SE 13950 20709',
                centroidGridReference: 'SE 13950 20709'
              },
              geometry: {
                type: 'Point',
                coordinates: [-1.7902611, 53.6826591]
              },
              id: '55974aa6-a4e2-411c-880c-24eddddd5efe'
            }
          ]
        },
        {
          rXmTGb: [
            {
              id: '95980907-3601-4cbf-b50a-c12b01c73d54',
              type: 'Feature',
              properties: {
                description: 'Dong',
                coordinateGridReference: 'SE 19655 44558',
                centroidGridReference: 'SE 49402 53623'
              },
              geometry: {
                coordinates: [
                  [
                    [-1.7023705, 53.8968342],
                    [-1.0541771, 53.8450134],
                    [-0.9882592, 54.1871317],
                    [-1.7023705, 53.8968342]
                  ]
                ],
                type: 'Polygon'
              }
            }
          ]
        },
        {
          rXmTGb: [
            {
              id: 'a43c28ad-7d85-4a34-bdd8-ced6182a1866',
              type: 'Feature',
              properties: {
                description: 'Woo',
                coordinateGridReference: 'SD 89375 62502',
                centroidGridReference: 'SE 20541 62000'
              },
              geometry: {
                coordinates: [
                  [-2.1637963, 54.0583609],
                  [-1.6584252, 53.7996174],
                  [-1.2409447, 54.3026835]
                ],
                type: 'LineString'
              }
            }
          ]
        }
      ]
    },
    files: {}
  },
  result: {
    files: {
      main: 'd059bca3-98b8-4d39-b81a-7cc23ee8862b',
      repeaters: {
        gAZbPt: '3b4eed8a-a331-48ff-90eb-ed860e0e7aaa'
      }
    }
  },
  recordCreatedAt: new Date('2026-03-17T13:35:34.303Z'),
  expireAt: new Date('2026-12-17T13:35:34.303Z')
}

/**
 * @type {import('@defra/forms-model').FormDefinition}
 */
const formDefinition = {
  name: 'First form',
  engine: Engine.V2,
  schema: 2,
  startPage: '/summary',
  pages: [
    {
      title: '',
      path: '/add-site-geospatial-features',
      components: [
        {
          type: ComponentType.GeospatialField,
          title: 'Add site geospatial features',
          name: 'DzDkCy',
          shortDescription: 'Site features',
          hint: '',
          options: {
            required: true
          },
          id: '6b4c5b0d-7a49-459e-b9dc-db0b18cbeaa7'
        }
      ],
      next: [],
      id: '0b608f84-d2e2-4158-9737-37bd49305fd3'
    },
    {
      title: 'Multisite Information',
      path: '/multisite-information',
      components: [
        {
          type: ComponentType.GeospatialField,
          title: 'Add site2 geospatial features',
          name: 'rXmTGb',
          shortDescription: 'Site features 2',
          hint: '',
          options: {
            required: false
          },
          id: '0109c4d4-bbcc-4aae-a1ee-86418ed33395'
        }
      ],
      next: [],
      id: '6963d67f-9f15-497d-ac3b-385542ca3dff',
      controller: ControllerType.Repeat,
      repeat: {
        options: {
          name: 'gAZbPt',
          title: 'Multisite'
        },
        schema: {
          min: 1,
          max: 5
        }
      }
    },
    {
      id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
      title: '',
      path: '/summary',
      controller: ControllerType.SummaryWithConfirmationEmail
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

describe('Submission routes', () => {
  /** @type {Server} */
  let server
  const mapReviewUrl =
    '/submission/88J-TKL-AU8/map-review/0b608f84-d2e2-4158-9737-37bd49305fd3/6b4c5b0d-7a49-459e-b9dc-db0b18cbeaa7'
  const mapRepeaterReviewUrl =
    '/submission/88J-TKL-AU8/map-review/6963d67f-9f15-497d-ac3b-385542ca3dff/0109c4d4-bbcc-4aae-a1ee-86418ed33395'

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  describe('GET', () => {
    test('should show view map page', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)
      jest
        .mocked(getFormDefinitionVersion)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: mapReviewUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
      expect($heading.textContent).toBe(
        '\n  88J-TKL-AU8\n  Add site geospatial features\n'
      )
    })

    test('should show view map page (no version)', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce({
        ...submissionRecord,
        meta: {
          ...submissionRecord.meta,
          versionMetadata: undefined
        }
      })
      jest.mocked(getLiveFormDefinition).mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: mapReviewUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
      expect($heading.textContent).toBe(
        '\n  88J-TKL-AU8\n  Add site geospatial features\n'
      )
    })

    test('should show view map repeater page', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)
      jest
        .mocked(getFormDefinitionVersion)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: mapRepeaterReviewUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
      expect($heading.textContent).toBe(
        '\n  88J-TKL-AU8\n  Add site2 geospatial features (multiple responses)\n'
      )
    })

    test('should fail to show view map page for an invalid component id', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)
      jest
        .mocked(getFormDefinitionVersion)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: '/submission/88J-TKL-AU8/map-review/0b608f84-d2e2-4158-9737-37bd49305fd3/00000000-0000-0000-0000-000000000000',
        auth
      }

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(StatusCodes.NOT_FOUND)
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { FormSubmissionDocument } from '~/src/services/formSubmissionService.js'
 */
