import {
  ComponentType,
  ControllerType,
  Engine,
  FormStatus,
  GeospatialFieldGeometryTypesEnum
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import {
  getFormDefinitionVersion,
  getLiveFormDefinition
} from '~/src/lib/forms.js'
import { getSubmissionRecord } from '~/src/services/formSubmissionService.js'
import { auth, authSuperAdmin } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/services/formSubmissionService.js')

describe('Submission routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /', () => {
    const submissionRecord = {
      _id: '6a63529b44fec27490abdbea',
      meta: {
        schemaVersion: 1,
        timestamp: new Date('2026-07-24T11:55:06.031Z'),
        referenceNumber: 'RWU-DPB-HZE',
        formName: 'Components',
        formId: '6a61e01bb001f0de83297a2f',
        formSlug: 'components',
        status: FormStatus.Draft,
        isPreview: true,
        notificationEmail: 'david.stone1@defra.gov.uk',
        versionMetadata: {
          versionNumber: 33,
          createdAt: new Date('2026-07-24T11:50:13.753Z')
        }
      },
      data: {
        main: {
          unsectionedPageField: 'Yo',
          textField: 'Enrique Chase',
          multilineTextField:
            'I’m well and truly stumped. My PR is running through fine (linting, unit tests etc) but the Sonar step reports ‘too many parameters’ on a call that I have updated in forms-model (with a new npm version in my PR).',
          numberField: 3,
          datePartsField: {
            day: 1,
            month: 1,
            year: 2001
          },
          yesNoField: true,
          emailAddressField: 'enrique.chase@defra.gov.uk',
          telephoneNumberField: '01234 567890',
          addressField: {
            addressLine1: '131 Chester Road',
            addressLine2: 'Chester Road',
            town: 'NORTHWICH',
            county: 'Cheshire',
            postcode: 'CW8 4AA'
          },
          radiosField: 'soleTrader',
          selectField: 910400003,
          checkboxesField: ['Arabian', 'Patomine', 'Shetland'],
          monthYearField: {
            month: 1,
            year: 2001
          },
          autocompleteField: 'pr',
          eastingNorthingField: {
            easting: 466777,
            northing: 481411
          },
          latLongField: {
            latitude: 54.3971307,
            longitude: -3.3722924
          },
          osGridRefField: 'NY 77436 20124',
          nationalGridFieldNumberField: 'NG 1234 5678',
          geospatialField: [
            {
              type: 'Feature',
              properties: {
                description: 'Point 1',
                coordinateGridReference: 'SE 00163 47398',
                centroidGridReference: 'SE 00163 47398'
              },
              geometry: {
                type: 'Point',
                coordinates: [-1.9990014, 53.9227206]
              },
              id: '9525de2d-950e-48f3-bb30-e317217629fe'
            },
            {
              id: '603a855a-ce3c-4167-8db4-b03c4c2e8772',
              type: 'Feature',
              properties: {
                description: 'Shape 1',
                coordinateGridReference: 'SE 13261 07658',
                centroidGridReference: 'SE 29453 17153'
              },
              geometry: {
                coordinates: [
                  [
                    [-1.8012475, 53.565375],
                    [-1.3068627, 53.6566241],
                    [-1.5595482, 53.7281816],
                    [-1.8012475, 53.565375]
                  ]
                ],
                type: 'Polygon'
              }
            },
            {
              id: 'a5f82313-1153-44f1-b1a5-a4cff203251e',
              type: 'Feature',
              properties: {
                description: 'Line 1',
                coordinateGridReference: 'SE 93128 17263',
                centroidGridReference: 'SE 36092 03641'
              },
              geometry: {
                coordinates: [
                  [-0.5927514, 53.6436006],
                  [-1.3947533, 53.3560645],
                  [-2.3835229, 53.584945]
                ],
                type: 'LineString'
              }
            }
          ]
        },
        repeaters: {
          bRpVOv: [
            {
              PULqgd: 'Dad Chase',
              TKqbTU: {
                day: 1,
                month: 1,
                year: 2001
              },
              WffjBp: [
                {
                  type: 'Feature',
                  properties: {
                    description: 'Point 1/1',
                    coordinateGridReference: 'SD 85139 86845',
                    centroidGridReference: 'SD 85139 86845'
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [-2.2297143, 54.2770333]
                  },
                  id: 'bfe8018f-1d5a-434f-b448-e010629e6d1c'
                },
                {
                  id: 'ea73a504-3f45-4326-929b-ed8f2df5e70b',
                  type: 'Feature',
                  properties: {
                    description: 'Shape 1/1',
                    coordinateGridReference: 'NZ 05833 28036',
                    centroidGridReference: 'NY 87646 31340'
                  },
                  geometry: {
                    coordinates: [
                      [
                        [-1.9111107, 54.6474001],
                        [-2.2077416, 54.7870084],
                        [-2.4604271, 54.5965142],
                        [-1.9111107, 54.6474001]
                      ]
                    ],
                    type: 'Polygon'
                  }
                },
                {
                  id: '5fa06faf-5070-4dbb-a4bf-d0d78f49c5c9',
                  type: 'Feature',
                  properties: {
                    description: 'Line 1/1',
                    coordinateGridReference: 'NZ 24270 27389',
                    centroidGridReference: 'NZ 04165 43789'
                  },
                  geometry: {
                    coordinates: [
                      [-1.6254662, 54.6410429],
                      [-1.8232201, 54.8566324],
                      [-2.3615502, 54.8692784]
                    ],
                    type: 'LineString'
                  }
                }
              ]
            },
            {
              PULqgd: 'Mum Chase',
              TKqbTU: {
                day: 1,
                month: 1,
                year: 2001
              },
              WffjBp: [
                {
                  type: 'Feature',
                  properties: {
                    description: 'Point 1/2',
                    coordinateGridReference: 'NY 82375 11768',
                    centroidGridReference: 'NY 82375 11768'
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [-2.2736596, 54.5009315]
                  },
                  id: '954d637e-bb6e-4e95-862b-6c0055df9071'
                },
                {
                  id: '28c26aa8-bc62-4597-a242-5728da9365f4',
                  type: 'Feature',
                  properties: {
                    description: 'Shape 1/2',
                    coordinateGridReference: 'NZ 24960 30929',
                    centroidGridReference: 'NZ 03230 33901'
                  },
                  geometry: {
                    coordinates: [
                      [
                        [-1.6144799, 54.6728192],
                        [-2.0759057, 54.8692784],
                        [-2.1637963, 54.558308],
                        [-1.6144799, 54.6728192]
                      ]
                    ],
                    type: 'Polygon'
                  }
                },
                {
                  id: 'bf474a91-b642-4867-89f1-8bc903ecd45b',
                  type: 'Feature',
                  properties: {
                    description: 'Line 1/2',
                    coordinateGridReference: 'NZ 10829 13876',
                    centroidGridReference: 'NY 77177 15807'
                  },
                  geometry: {
                    coordinates: [
                      [-1.8342064, 54.5200659],
                      [-2.4714135, 54.4690208],
                      [-2.757058, 54.6219651]
                    ],
                    type: 'LineString'
                  }
                }
              ]
            },
            {
              PULqgd: 'Child Chase',
              TKqbTU: {
                day: 1,
                month: 1,
                year: 2001
              },
              WffjBp: [
                {
                  type: 'Feature',
                  properties: {
                    description: 'Point 1/3',
                    coordinateGridReference: 'SE 20478 21456',
                    centroidGridReference: 'SE 20478 21456'
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [-1.6913842, 53.6891653]
                  },
                  id: '53f2abf3-5c48-4966-862a-96fa24e1c70a'
                },
                {
                  id: '53fcefb1-6fd7-43a7-aea1-e304ba979248',
                  type: 'Feature',
                  properties: {
                    description: 'Shape 1/3',
                    coordinateGridReference: 'SK 28625 93913',
                    centroidGridReference: 'SE 05265 00124'
                  },
                  geometry: {
                    coordinates: [
                      [
                        [-1.5705346, 53.4412213],
                        [-1.9220971, 53.6305731],
                        [-2.2736596, 53.4215849],
                        [-1.5705346, 53.4412213]
                      ]
                    ],
                    type: 'Polygon'
                  }
                },
                {
                  id: '0270607c-65a2-4113-bc27-d21ef6cf6bf3',
                  type: 'Feature',
                  properties: {
                    description: 'Line 1/3',
                    coordinateGridReference: 'SE 71219 24846',
                    centroidGridReference: 'SE 56932 46758'
                  },
                  geometry: {
                    coordinates: [
                      [-0.9223412, 53.7151802],
                      [-1.0212182, 54.0325587],
                      [-1.4606713, 53.9938254]
                    ],
                    type: 'LineString'
                  }
                }
              ]
            }
          ]
        },
        files: {
          fileUploadField: [
            {
              fileId: '6da2c53b-2a94-4eb5-b520-34c60271bf9e',
              fileName: 'Page groups.jpg',
              userDownloadLink:
                'http://localhost:3000/file-download/6da2c53b-2a94-4eb5-b520-34c60271bf9e'
            },
            {
              fileId: '639c5495-add8-4df5-b94c-de9088688a3f',
              fileName: 'space.jpeg',
              userDownloadLink:
                'http://localhost:3000/file-download/639c5495-add8-4df5-b94c-de9088688a3f'
            }
          ]
        },
        payment: {
          paymentId: 'v0l2k3j2b4vu35at84s685666i',
          reference: 'RWU-DPB-HZE',
          amount: 5,
          description: 'Licence',
          createdAt: new Date('2026-07-24T11:55:06.031Z')
        }
      },
      result: {
        files: {
          main: 'b01bade3-45c5-4860-abe4-47d2b3086a88',
          repeaters: {
            bRpVOv: '864ea74f-8526-4a7c-8984-fec8add1c5c6'
          }
        }
      },
      recordCreatedAt: new Date('2026-07-24T11:55:07.210Z'),
      expireAt: new Date('2027-04-24T11:55:07.210Z')
    }

    /**
     * @type {import('@defra/forms-model').FormDefinition}
     */
    const formDefinition = {
      conditions: [],
      startPage: '/all-components',
      pages: [
        {
          path: '/all-components',
          title: 'All Components',
          components: [
            {
              type: ComponentType.TextField,
              name: 'textField',
              title: 'Text field',
              hint: 'Help text',
              options: {},
              schema: {},
              shortDescription: 'Text field',
              id: '8ba83e6b-c84b-4a14-95fa-2548be2e602d'
            },
            {
              type: ComponentType.MultilineTextField,
              name: 'multilineTextField',
              title: 'Multiline text field',
              hint: 'Help text',
              options: {},
              schema: {},
              shortDescription: 'Multiline text field',
              id: 'd4640182-2df6-474c-9e36-73b543112644'
            },
            {
              type: ComponentType.NumberField,
              name: 'numberField',
              title: 'Number field',
              options: {},
              schema: {},
              shortDescription: 'Number field',
              id: 'a27ce61b-5cd3-40b2-99de-5563964db3fb'
            },
            {
              type: ComponentType.DatePartsField,
              name: 'datePartsField',
              title: 'Date parts field',
              options: {},
              shortDescription: 'Date parts field',
              id: 'd4e39dff-abb1-475b-be0d-b895034408bc'
            },
            {
              type: ComponentType.YesNoField,
              name: 'yesNoField',
              title: 'Yes/No field',
              options: {},
              shortDescription: 'Yes/No field',
              id: '19d6cbeb-62cc-455d-a6d0-b77435b964d7'
            },
            {
              type: ComponentType.EmailAddressField,
              name: 'emailAddressField',
              title: 'Email address field',
              options: {},
              shortDescription: 'Email address field',
              id: 'a572e007-d200-41d3-8557-184d1f8defe1'
            },
            {
              type: ComponentType.TelephoneNumberField,
              name: 'telephoneNumberField',
              title: 'Telephone number field',
              options: {},
              shortDescription: 'Telephone number field',
              id: 'fb74ca96-25c5-458b-997e-4e125e76ecfc'
            },
            {
              type: ComponentType.UkAddressField,
              name: 'addressField',
              title: 'UK address field',
              options: {},
              shortDescription: 'UK address field',
              id: '6913b48c-f82c-42bc-8e37-9c2e18e2f352'
            },
            {
              type: ComponentType.RadiosField,
              name: 'radiosField',
              title: 'Radios field',
              list: '15e990b5-cff4-46fd-8e97-ede57e4cb788',
              options: {},
              shortDescription: 'Radios field',
              id: '735f845d-65cb-491f-a019-c5af15f9cd94'
            },
            {
              type: ComponentType.SelectField,
              name: 'selectField',
              title: 'Select field',
              list: '3bb5ec21-9881-4b31-acd7-6beb08aff14b',
              options: {},
              shortDescription: 'Select field',
              id: 'b10086db-b92b-4752-bc23-a4d93979cb10'
            },
            {
              options: {},
              list: '54603574-ebb3-4bbb-aee7-ad5dada33c82',
              type: ComponentType.CheckboxesField,
              name: 'checkboxesField',
              title: 'Checkboxes field',
              hint: 'Please help',
              schema: {},
              shortDescription: 'Checkboxes field',
              id: '28b69e99-44d5-496c-a7bb-6ec0bfb2294e'
            },
            {
              type: ComponentType.Html,
              name: 'html',
              title: 'Html',
              content: '<p class="govuk-body">Paragraph...</p>',
              options: {},
              id: 'ef109bf5-d62f-474d-b460-54781d157a1e'
            },
            {
              type: ComponentType.MonthYearField,
              title: 'Month year field',
              name: 'monthYearField',
              shortDescription: 'Month year',
              hint: '',
              options: {
                required: true
              },
              id: '09b2227f-623f-4ae1-a0a4-5ddaa589b070'
            },
            {
              type: ComponentType.AutocompleteField,
              title: 'Autocomplete field',
              name: 'autocompleteField',
              shortDescription: 'Autocomplete field',
              hint: '',
              options: {
                required: true
              },
              list: 'fb0bc8b4-c5c6-4ece-8950-15f978cdbba8',
              id: '6af3b857-2b60-4b0a-902f-d7f339554e36'
            },
            {
              type: ComponentType.EastingNorthingField,
              title: 'Easting Northing field',
              name: 'eastingNorthingField',
              shortDescription: 'Easting Northing field',
              hint: 'For example. Easting: 248741, Northing: 63688',
              options: {
                required: true,
                classes: '',
                mapLayers: {
                  sssi: true
                }
              },
              schema: {},
              id: 'c3c34170-3063-49bb-b66c-436e5d3e0158'
            },
            {
              type: ComponentType.LatLongField,
              title: 'Latitude longitude field',
              name: 'latLongField',
              shortDescription: 'Latitude longitude field',
              hint: 'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767',
              options: {
                required: true,
                classes: ''
              },
              schema: {},
              id: '43a8959c-7255-4174-91d5-6bf03980aefe'
            },
            {
              type: ComponentType.OsGridRefField,
              title: 'OS grid reference field',
              name: 'osGridRefField',
              shortDescription: 'OS grid reference field',
              hint: 'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456',
              options: {
                required: true,
                classes: ''
              },
              id: 'c1cc4b5e-f493-4d9b-9f86-eb6754329634'
            },
            {
              type: ComponentType.NationalGridFieldNumberField,
              title: 'National Grid field number field',
              name: 'nationalGridFieldNumberField',
              shortDescription: 'National Grid field number field',
              hint: 'A National Grid field number is made up of 2 letters and 8 numbers, for example, NG 1234 5678',
              options: {
                required: true,
                classes: ''
              },
              id: '54ad6535-75e8-4ee3-ad2a-4c854f1d3ab2'
            }
          ],
          next: [],
          id: '7dcdd33a-4c30-4548-83bb-edc11731107c',
          section: '274edf9b-0e54-44e3-aa42-b21d0e02a7ce'
        },
        {
          title: '',
          path: '/geospatial-field',
          components: [
            {
              type: ComponentType.GeospatialField,
              title: 'Geospatial field',
              name: 'geospatialField',
              shortDescription: 'Geospatial field',
              hint: '',
              options: {
                required: true,
                geometryTypes: [
                  GeospatialFieldGeometryTypesEnum.Point,
                  GeospatialFieldGeometryTypesEnum.Line,
                  GeospatialFieldGeometryTypesEnum.Shape
                ]
              },
              schema: {},
              id: '9b99f349-4891-492f-b669-10abc5ed1cf1'
            }
          ],
          next: [],
          id: 'e6ad8e99-d599-4c08-a081-bedc0c9268e1',
          section: '8bbc5859-ca64-42ed-8a32-6882ed3fe6c9'
        },
        {
          controller: ControllerType.FileUpload,
          title: '',
          path: '/file-upload-field',
          components: [
            {
              type: ComponentType.FileUploadField,
              title: 'File upload field',
              name: 'fileUploadField',
              shortDescription: 'File upload field',
              hint: '',
              options: {
                required: true
              },
              schema: {},
              id: 'bb5f685d-3a2e-449e-96a9-adb5f6dbb5ee'
            }
          ],
          next: [],
          id: 'b50d7488-cdee-4653-9090-c00a5f886ea4',
          section: '8bbc5859-ca64-42ed-8a32-6882ed3fe6c9'
        },
        {
          title: 'Repeater page title',
          path: '/repeater-page',
          components: [
            {
              type: ComponentType.TextField,
              title: 'Text field',
              name: 'PULqgd',
              shortDescription: 'Text field',
              hint: '',
              options: {
                required: true,
                classes: ''
              },
              schema: {},
              id: '44002819-c60d-4960-9136-7ddae50b7603'
            },
            {
              type: ComponentType.DatePartsField,
              title: 'Date parts field',
              name: 'TKqbTU',
              shortDescription: 'Date parts field',
              hint: '',
              options: {
                required: true,
                classes: ''
              },
              id: 'd5e7d4e5-b39f-4d3f-a2d8-c39b392c52fe'
            },
            {
              type: ComponentType.GeospatialField,
              title: 'Geospatial field',
              name: 'WffjBp',
              shortDescription: 'Geospatial field',
              hint: '',
              options: {
                required: true,
                geometryTypes: [
                  GeospatialFieldGeometryTypesEnum.Point,
                  GeospatialFieldGeometryTypesEnum.Line,
                  GeospatialFieldGeometryTypesEnum.Shape
                ]
              },
              schema: {},
              id: '4e50b4a2-a443-4e0b-a2e0-49008605b34c'
            }
          ],
          next: [],
          id: '98b46e3f-02fb-44d3-807a-0e0ee90d0722',
          controller: ControllerType.Repeat,
          repeat: {
            options: {
              name: 'bRpVOv',
              title: 'Thing'
            },
            schema: {
              min: 1,
              max: 5
            }
          }
        },
        {
          title: '',
          path: '/unsectioned-page',
          components: [
            {
              type: ComponentType.TextField,
              title: 'Unsectioned page',
              name: 'unsectionedPageField',
              shortDescription: 'Unsectioned page',
              hint: '',
              options: {
                required: true,
                classes: ''
              },
              schema: {},
              id: '25c98cf9-cf20-440d-94ce-2e7389e87bc3'
            }
          ],
          next: [],
          id: '6512a1ad-4819-48c3-b7f9-4e6c930a0457'
        },
        {
          title: '',
          path: '/optional-page',
          components: [
            {
              type: ComponentType.TextField,
              title: 'Optional page',
              name: 'optionalPageField',
              shortDescription: 'Optional page',
              hint: '',
              options: {
                required: false,
                classes: ''
              },
              schema: {},
              id: '146ee593-7c88-4f27-92bd-cafe6f2fa106'
            }
          ],
          next: [],
          id: '2cb5d8b2-ec52-4d59-ad8c-88b483a095e5'
        },
        {
          title: '',
          path: '/payment-required',
          components: [
            {
              type: ComponentType.PaymentField,
              title: 'Payment required',
              name: 'MOfzGz',
              options: {
                required: true,
                amount: 5,
                description: 'Licence'
              },
              id: 'fbb71485-a092-4c04-bd73-112b96cb3cfa'
            }
          ],
          next: [],
          id: '3185b5a6-d9c1-4885-bc8d-4f111b342fff'
        },
        {
          title: 'Check your answers',
          controller: ControllerType.Summary,
          path: '/summary',
          components: [],
          id: 'dba9d1c1-cd8b-4cca-b5dd-e5e9aa9519c9'
        }
      ],
      sections: [
        {
          id: '274edf9b-0e54-44e3-aa42-b21d0e02a7ce',
          name: 'section-1',
          title: 'Section 1',
          hideTitle: false
        },
        {
          id: '8bbc5859-ca64-42ed-8a32-6882ed3fe6c9',
          name: 'section-12',
          title: 'Section 2',
          hideTitle: false
        }
      ],
      lists: [
        {
          name: 'companyType',
          title: 'Company type',
          type: 'string',
          items: [
            {
              text: 'Sole trader',
              value: 'soleTrader',
              id: '3e83ce56-c534-40e8-ba33-4444106b2eb0'
            },
            {
              text: 'Private Limited Company',
              value: 'privateLimitedCompany',
              id: 'a892a67e-0bc9-4e7f-ae98-2bca62215589'
            },
            {
              text: 'Public Limited Company',
              value: 'publicLimitedCompany',
              id: '4472db07-ac88-42cb-baac-c2e086d709e1'
            },
            {
              text: 'Limited Liability Partnership',
              value: 'limitedLiabilityPartnership',
              id: '180d752d-96d5-46d8-9d15-75776ef96002'
            },
            {
              text: 'Charity',
              value: 'charity',
              id: '85c76120-d154-40e0-8ee7-2029a2218bd9'
            },
            {
              text: 'Other',
              value: 'other',
              id: '0e182299-fb9f-499c-9ba3-ce8f9cb0e667'
            }
          ],
          id: '15e990b5-cff4-46fd-8e97-ede57e4cb788'
        },
        {
          name: 'country',
          title: 'Country',
          type: 'number',
          items: [
            {
              text: 'Afghanistan',
              value: 910400000,
              id: '9eb0bf67-2e13-4fcf-8b42-6f818e7bc403'
            },
            {
              text: 'Albania',
              value: 910400001,
              id: 'd09c6275-9036-4897-8d21-d24a4badd7b0'
            },
            {
              text: 'Algeria',
              value: 910400002,
              id: '8e84568a-3d13-47e7-b8ea-52a0e87c858c'
            },
            {
              text: 'Andorra',
              value: 910400003,
              id: '3d704c08-7e03-4f5b-927c-373ca315eef6'
            },
            {
              text: 'England',
              value: 910400195,
              id: '7be436ab-3dfc-4987-a8d8-447c4ac53ab8'
            },
            {
              text: 'Wales',
              value: 910400196,
              id: 'f04e00fe-47fa-4d63-859d-5592ce77fed4'
            },
            {
              text: 'Scotland',
              value: 910400197,
              id: '83b524cc-9439-4982-b871-8e883579dbe1'
            },
            {
              text: 'Northern Ireland',
              value: 910400198,
              id: 'ff2ce174-a0ef-41f6-ae13-d5576352ef70'
            }
          ],
          id: '3bb5ec21-9881-4b31-acd7-6beb08aff14b'
        },
        {
          name: 'horseBreed',
          title: 'Horse breed',
          type: 'string',
          items: [
            {
              text: 'Arabian',
              value: 'Arabian',
              id: '74af52a9-312a-4043-a983-a17ed8e9f829'
            },
            {
              text: 'Patomine',
              value: 'Patomine',
              id: 'cfeb57ed-2a33-4ec1-9099-b014f7e01174'
            },
            {
              text: 'Shire',
              value: 'Shire',
              id: 'b8acaffa-8575-43e8-b315-70ff33493595'
            },
            {
              text: 'Shetland',
              value: 'Shetland',
              id: '1eb595aa-217e-47fc-aa4f-d5985fc7c5f0'
            },
            {
              text: 'Race',
              value: 'Race',
              id: 'ff34c489-5b5e-489b-8f7c-fadac094d70c'
            }
          ],
          id: '54603574-ebb3-4bbb-aee7-ad5dada33c82'
        },
        {
          name: 'cLdVYW',
          title: 'List for question QsOwQS',
          type: 'string',
          items: [
            {
              text: 'English',
              value: 'en-gb',
              id: '3d59c575-d24a-499f-b663-8e4c376630db'
            },
            {
              text: 'French',
              value: 'fr',
              id: 'bdd57c85-5eda-43eb-b13e-ad1dcd0861da'
            },
            {
              text: 'Spanish',
              value: 'es',
              id: 'e3d419be-bbaf-4549-9272-3982b6de4a62'
            },
            {
              text: 'Portuguese',
              value: 'pr',
              id: '9edffeb7-8840-4584-b9d9-f1043574310e'
            }
          ],
          id: 'fb0bc8b4-c5c6-4ece-8950-15f978cdbba8'
        }
      ],
      engine: Engine.V2,
      schema: 2,
      name: 'Components',
      metadata: {
        $$__formVersion: {
          versionNumber: 33,
          createdAt: new Date('2026-07-24T11:50:13.753Z')
        }
      }
    }

    const reviewUrl = '/submission/RWU-DPB-HZE'

    test('should show view submission page', async () => {
      jest
        .mocked(getSubmissionRecord)
        .mockResolvedValueOnce(/** @type {any} */ (submissionRecord))
      jest
        .mocked(getFormDefinitionVersion)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: reviewUrl,
        auth: authSuperAdmin
      }

      const { container, response } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
      expect($heading.textContent).toBe(`\n  Components\n  RWU-DPB-HZE\n`)

      expect(response.result).toMatchSnapshot()
    })

    test('should not show view submission page without the correct scope', async () => {
      jest
        .mocked(getSubmissionRecord)
        .mockResolvedValueOnce(/** @type {any} */ (submissionRecord))
      jest
        .mocked(getFormDefinitionVersion)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
        url: reviewUrl,
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
    })
  })

  describe('GET /map-review', () => {
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

    /** @type {GeospatialFieldComponent} */
    const firstComponent = {
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

    /** @type {Page} */
    const firstPage = {
      title: '',
      path: '/add-site-geospatial-features',
      components: [firstComponent],
      next: [],
      id: '0b608f84-d2e2-4158-9737-37bd49305fd3'
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
        firstPage,
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

    const mapReviewUrl =
      '/submission/88J-TKL-AU8/map-review/0b608f84-d2e2-4158-9737-37bd49305fd3/6b4c5b0d-7a49-459e-b9dc-db0b18cbeaa7'
    const mapRepeaterReviewUrl =
      '/submission/88J-TKL-AU8/map-review/6963d67f-9f15-497d-ac3b-385542ca3dff/0109c4d4-bbcc-4aae-a1ee-86418ed33395'

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

    test('should show view map page with SSSI layer enabled', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)

      jest.mocked(getFormDefinitionVersion).mockResolvedValueOnce({
        ...formDefinition,
        pages: [
          {
            ...firstPage,
            components: [
              {
                ...firstComponent,
                options: {
                  ...firstComponent.options,
                  mapLayers: { sssi: true }
                }
              },
              ...firstPage.components.slice(1)
            ]
          },
          ...formDefinition.pages.slice(1)
        ]
      })

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

    test('should show view map page with SSSI layer disabled', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)

      jest.mocked(getFormDefinitionVersion).mockResolvedValueOnce({
        ...formDefinition,
        pages: [
          {
            ...firstPage,
            components: [
              {
                ...firstComponent,
                options: {
                  ...firstComponent.options,
                  mapLayers: { sssi: false }
                }
              },
              ...firstPage.components.slice(1)
            ]
          },
          ...formDefinition.pages.slice(1)
        ]
      })

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
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { Page, GeospatialFieldComponent } from '@defra/forms-model'
 * @import { FormSubmissionDocument } from '~/src/services/formSubmissionService.js'
 */
