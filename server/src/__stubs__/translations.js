import {
  ComponentType,
  ControllerType,
  Engine,
  GeospatialFieldGeometryTypesEnum
} from '@defra/forms-model'

/** @type {FormDefinition} */
export const formWithAllComponents = {
  name: 'All components',
  engine: Engine.V2,
  schema: 2,
  startPage: '/summary',
  pages: [
    {
      title: 'All components',
      path: '/all-components',
      components: [
        {
          type: ComponentType.TextField,
          title: 'Short answer',
          name: 'CehEFj',
          shortDescription: 'Short answer',
          hint: '',
          options: {
            required: true,
            classes: ''
          },
          schema: {},
          id: 'b4223878-3118-4b60-b035-752891045099'
        },
        {
          type: ComponentType.MultilineTextField,
          title: 'Long answer',
          name: 'KtHIlj',
          shortDescription: 'Long answer',
          hint: '',
          options: {
            required: true,
            classes: ''
          },
          schema: {},
          id: '3598358d-d848-4754-b761-fa796cf99adb'
        },
        {
          type: ComponentType.NumberField,
          title: 'Number',
          name: 'EpotfG',
          shortDescription: 'Number',
          hint: '',
          options: {
            required: true,
            classes: '',
            prefix: '',
            suffix: ''
          },
          schema: {},
          id: '70b246ab-a211-48e0-aad9-cb0061571b01'
        },
        {
          type: ComponentType.DatePartsField,
          title: 'Date parts',
          name: 'ohcBYh',
          shortDescription: 'Date parts',
          hint: '',
          options: {
            required: true,
            classes: ''
          },
          id: '91681020-3c36-4df8-9f67-0467715ee2a2'
        },
        {
          type: ComponentType.MonthYearField,
          title: 'Month year',
          name: 'EANLAZ',
          shortDescription: 'Month year',
          hint: '',
          options: {
            required: true
          },
          id: '174166df-a183-4c0e-94f3-340bf9198987'
        },
        {
          type: ComponentType.TelephoneNumberField,
          title: 'Phone number',
          name: 'IizqAp',
          shortDescription: 'Phone number',
          hint: '',
          options: {
            required: true,
            classes: ''
          },
          id: '1e923a1c-520e-4522-97a4-030e3ada42e9'
        },
        {
          type: ComponentType.EmailAddressField,
          title: 'Email address',
          name: 'djFrbW',
          shortDescription: 'Email address',
          hint: '',
          options: {
            required: true,
            classes: ''
          },
          id: '1c69c478-ce1a-416f-bba9-941bc04b7116'
        },
        {
          type: ComponentType.YesNoField,
          title: 'Yes no',
          name: 'HPOFhP',
          shortDescription: 'Yes no',
          hint: '',
          options: {
            required: true
          },
          id: '8c7fda14-b4ed-45ab-b146-34cc8c116c1e'
        },
        {
          type: ComponentType.CheckboxesField,
          title: 'Checkboxes',
          name: 'ThveXB',
          shortDescription: 'Checkboxes',
          hint: '',
          options: {
            required: true
          },
          schema: {},
          list: 'cf9ce8f0-4164-4eec-9703-0cf59a8363c4',
          id: '50330e94-6e83-458d-9584-fd741dfbc7e8'
        },
        {
          type: ComponentType.RadiosField,
          title: 'Radios',
          name: 'umITEP',
          shortDescription: 'Radios',
          hint: '',
          options: {
            required: true
          },
          list: '53a74b46-87eb-4e6d-a3af-b332810eca96',
          id: '63e17bf3-ed88-4812-b281-0996aa735e74'
        },
        {
          type: ComponentType.AutocompleteField,
          title: 'Autocomplete',
          name: 'KWujAU',
          shortDescription: 'Autocomplete',
          hint: '',
          options: {
            required: true
          },
          list: 'b5fc45f7-b24e-435a-9d88-ae3178bcdf63',
          id: '2bc63742-6d84-4df0-92a4-abd73aba26cc'
        },
        {
          type: ComponentType.SelectField,
          title: 'Select',
          name: 'hlzEXp',
          shortDescription: 'Select',
          hint: '',
          options: {
            required: true
          },
          list: '53263b33-5211-47c3-aaae-85428664c2a4',
          id: 'd7d272f9-94e7-4a04-879f-e6f17b1f233f'
        }
      ],
      next: [],
      id: '81c5b8d4-9a8d-4e6e-a948-5fae53ffd618'
    },
    {
      controller: ControllerType.FileUpload,
      title: '',
      path: '/supporting-evidence',
      components: [
        {
          type: ComponentType.FileUploadField,
          title: 'Supporting evidence',
          name: 'PAVNAG',
          shortDescription: 'Supporting evidence',
          hint: '',
          options: {
            required: true
          },
          schema: {},
          id: '1bd7bcad-060f-44d2-ba15-bd5f7d3efa8a'
        }
      ],
      next: [],
      id: '59752028-8189-4099-9794-0cc251f8e81b'
    },
    {
      title: '',
      path: '/declaration',
      components: [
        {
          type: ComponentType.DeclarationField,
          title: 'Declaration',
          name: 'IirupW',
          shortDescription: 'Declaration',
          content: 'Declaration markdown text',
          options: {
            required: true
          },
          id: '4dd3983d-b3bd-4572-9653-6e4bc13e1f04'
        }
      ],
      next: [],
      id: '51548364-f4f5-44f5-a2b6-37d1845626ef'
    },
    {
      title: 'Guidance page',
      path: '/guidance-page',
      components: [
        {
          type: ComponentType.Markdown,
          content: 'Guidance markdown text',
          options: {},
          name: 'niggAE',
          title: 'Guidance title',
          id: '8daa16fa-50b5-4a75-8e16-96d83775fea9'
        }
      ],
      next: [],
      id: 'a3060899-5aff-41b6-b825-fde80d360fc8'
    },
    {
      title: 'Locations',
      path: '/locations',
      components: [
        {
          type: ComponentType.UkAddressField,
          title: 'UK address',
          name: 'VrYGsh',
          shortDescription: 'UK address',
          hint: 'UK address hint',
          options: {
            required: true
          },
          id: '858f2da9-f593-4c7f-a3e5-5ee603e17eea'
        },
        {
          type: ComponentType.EastingNorthingField,
          title: 'Easting and northing',
          name: 'iBjBGR',
          shortDescription: 'Easting and northing',
          hint: 'For example. Easting: 248741, Northing: 63688',
          options: {
            required: true,
            classes: '',
            instructionText:
              'Follow these instructions:\r\n\r\n1. Search for a place or postcode.\r\n2. Use the + and - icons to zoom in and out.\r\n3. Use a mouse or keyboard to centre the point at the location.\r\n4. Click to add the location to the map.'
          },
          schema: {},
          id: 'b9620b02-e44c-4a7b-97e1-3e9980e3cbb8'
        },
        {
          type: ComponentType.OsGridRefField,
          title: 'OS grid reference',
          name: 'kjfwCe',
          shortDescription: 'OS grid reference',
          hint: 'An OS grid reference number is made up of 2 letters followed by either 6, 8 or 10 numbers, for example, TQ123456',
          options: {
            required: true,
            classes: '',
            instructionText:
              'Follow these instructions:\r\n\r\n1. Search for a place or postcode.\r\n2. Use the + and - icons to zoom in and out.\r\n3. Use a mouse or keyboard to centre the point at the location.\r\n4. Click to add the location to the map.'
          },
          id: 'a47d23b3-fef7-4ced-9234-c6b95cff5e08'
        },
        {
          type: ComponentType.NationalGridFieldNumberField,
          title: 'National Grid field number',
          name: 'ZHLaIO',
          shortDescription: 'National Grid field number',
          hint: 'A National Grid field number is made up of 2 letters and 8 numbers, for example, NG 1234 5678',
          options: {
            required: true,
            classes: '',
            instructionText:
              'Follow these instructions:\r\n\r\n1. Search for a place or postcode.\r\n2. Use the + and - icons to zoom in and out.\r\n3. Use a mouse or keyboard to centre the point at the location.\r\n4. Click to add the location to the map.'
          },
          id: 'ff3978d6-5567-4348-82f9-6c3ecf112d5b'
        },
        {
          type: ComponentType.LatLongField,
          title: 'Longitude and latitude',
          name: 'lFmSKV',
          shortDescription: 'Longitude and latitude',
          hint: 'For Great Britain, the latitude will be a number between 49.850 and 60.859. The longitude will be a number between -13.687 and 1.767',
          options: {
            required: true,
            classes: '',
            instructionText:
              'Follow these instructions:\r\n\r\n1. Search for a place or postcode.\r\n2. Use the + and - icons to zoom in and out.\r\n3. Use a mouse or keyboard to centre the point at the location.\r\n4. Click to add the location to the map.'
          },
          schema: {},
          id: '8ad7d38f-8f90-4104-becf-9fcfa09537b6'
        },
        {
          type: ComponentType.GeospatialField,
          title: 'Area on map',
          name: 'aTqaeh',
          shortDescription: 'Area on map',
          hint: 'Area on map hint',
          options: {
            required: true,
            geometryTypes: [
              GeospatialFieldGeometryTypesEnum.Point,
              GeospatialFieldGeometryTypesEnum.Line,
              GeospatialFieldGeometryTypesEnum.Shape
            ]
          },
          schema: {},
          id: 'cd47a9e7-1af8-4e39-8c0a-b82f8fd512f2'
        }
      ],
      next: [],
      id: '18f05ce2-a506-4878-8f5b-2642e6b2e1b0'
    },
    {
      title: '',
      path: '/payment-required',
      components: [
        {
          type: ComponentType.PaymentField,
          title: 'Payment required',
          name: 'XwsmjZ',
          options: {
            required: true,
            amount: 10,
            description: 'Pay for something'
          },
          id: '9273441f-b8a4-49ff-8fa1-a9afdeb4b2f2'
        }
      ],
      next: [],
      id: '11ea1eb0-d19c-445c-a538-728d0d9ca53b'
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
  lists: [
    {
      name: 'XTURwf',
      title: 'List for question ThveXB',
      type: 'string',
      items: [
        {
          id: 'bbbc79ba-e266-4895-97f8-4096a9ae6ae0',
          text: 'Checkbox 1',
          value: 'Checkbox 1'
        },
        {
          id: '6c3f7307-11f6-4e6f-94c0-c67deed100fd',
          text: 'Checkbox 2',
          hint: {
            text: 'Checkbox 2 hint',
            id: '0e3f06ce-022c-480f-80f7-09c22acf3b46'
          },
          value: 'Checkbox 2'
        }
      ],
      id: 'cf9ce8f0-4164-4eec-9703-0cf59a8363c4'
    },
    {
      name: 'WAvEyP',
      title: 'List for question umITEP',
      type: 'string',
      items: [
        {
          id: 'daffd89b-c400-45e9-a301-2ba66c4a7de8',
          text: 'Radio 1',
          hint: {
            text: 'Radio 1 hint',
            id: 'd176f0fc-064b-479d-83e5-dd133a787e9f'
          },
          value: 'Radio 1'
        },
        {
          id: '436e8786-f9ab-46fa-be7e-792c5b7a7ef1',
          text: 'Radio 2',
          value: 'Radio 2'
        }
      ],
      id: '53a74b46-87eb-4e6d-a3af-b332810eca96'
    },
    {
      name: 'OLNODZ',
      title: 'List for question KWujAU',
      type: 'string',
      items: [
        {
          text: 'Option 1',
          value: 'Option 1',
          id: '31c46f7d-d114-4d54-9eca-5fb42a1f9280'
        },
        {
          text: 'Option 2',
          value: 'Option 2',
          id: '4e309391-77d6-41dc-91cd-0423dc62ae13'
        }
      ],
      id: 'b5fc45f7-b24e-435a-9d88-ae3178bcdf63'
    },
    {
      name: 'IBDcON',
      title: 'List for question hlzEXp',
      type: 'string',
      items: [
        {
          id: '5762b4c6-522e-4b7e-ac6c-ed28a0ee78b1',
          text: 'Select 1',
          hint: {
            text: 'Select 1 hint',
            id: '0df35a07-5bd0-4549-9b4d-9dd08fc2aad7'
          },
          value: 'Select 1'
        },
        {
          id: '3dbe7ced-8489-4735-b2b4-4a0eccfab2c5',
          text: 'Select 2',
          value: 'Select 2'
        }
      ],
      id: '53263b33-5211-47c3-aaae-85428664c2a4'
    }
  ],
  metadata: {
    $$__formVersion: {
      versionNumber: 33,
      createdAt: '2026-07-16T09:45:44.522Z'
    },
    translations: {
      cy: {
        'form.title': '',
        'form.contact.email.address': '',
        'form.contact.email.responseTime': '',
        'form.contact.online.url': '',
        'form.contact.online.text': '',
        'form.contact.phone': '',
        'form.submissionGuidance': '',
        'form.privacyNoticeUrl': '',
        'pages.81c5b8d4-9a8d-4e6e-a948-5fae53ffd618.title': '',
        'components.b4223878-3118-4b60-b035-752891045099.title': '',
        'components.b4223878-3118-4b60-b035-752891045099.shortDescription': '',
        'components.3598358d-d848-4754-b761-fa796cf99adb.title': '',
        'components.3598358d-d848-4754-b761-fa796cf99adb.shortDescription': '',
        'components.70b246ab-a211-48e0-aad9-cb0061571b01.title': '',
        'components.70b246ab-a211-48e0-aad9-cb0061571b01.shortDescription': '',
        'components.91681020-3c36-4df8-9f67-0467715ee2a2.title': '',
        'components.91681020-3c36-4df8-9f67-0467715ee2a2.shortDescription': '',
        'components.174166df-a183-4c0e-94f3-340bf9198987.title': '',
        'components.174166df-a183-4c0e-94f3-340bf9198987.shortDescription': '',
        'components.1e923a1c-520e-4522-97a4-030e3ada42e9.title': '',
        'components.1e923a1c-520e-4522-97a4-030e3ada42e9.shortDescription': '',
        'components.1c69c478-ce1a-416f-bba9-941bc04b7116.title': '',
        'components.1c69c478-ce1a-416f-bba9-941bc04b7116.shortDescription': '',
        'components.8c7fda14-b4ed-45ab-b146-34cc8c116c1e.title': '',
        'components.8c7fda14-b4ed-45ab-b146-34cc8c116c1e.shortDescription': '',
        'listItems.02900d42-83d1-4c72-a719-c4e8228952fa.text': '',
        'listItems.f39000eb-c51b-4019-8f82-bbda0423f04d.text': '',
        'components.50330e94-6e83-458d-9584-fd741dfbc7e8.title': '',
        'components.50330e94-6e83-458d-9584-fd741dfbc7e8.shortDescription': '',
        'listItems.bbbc79ba-e266-4895-97f8-4096a9ae6ae0.text': '',
        'listItems.6c3f7307-11f6-4e6f-94c0-c67deed100fd.text': '',
        'listItems.6c3f7307-11f6-4e6f-94c0-c67deed100fd.hint': '',
        'components.63e17bf3-ed88-4812-b281-0996aa735e74.title': '',
        'components.63e17bf3-ed88-4812-b281-0996aa735e74.shortDescription': '',
        'listItems.daffd89b-c400-45e9-a301-2ba66c4a7de8.text': '',
        'listItems.daffd89b-c400-45e9-a301-2ba66c4a7de8.hint': '',
        'listItems.436e8786-f9ab-46fa-be7e-792c5b7a7ef1.text': '',
        'components.2bc63742-6d84-4df0-92a4-abd73aba26cc.title': '',
        'components.2bc63742-6d84-4df0-92a4-abd73aba26cc.shortDescription': '',
        'listItems.31c46f7d-d114-4d54-9eca-5fb42a1f9280.text': '',
        'listItems.4e309391-77d6-41dc-91cd-0423dc62ae13.text': '',
        'components.d7d272f9-94e7-4a04-879f-e6f17b1f233f.title': '',
        'components.d7d272f9-94e7-4a04-879f-e6f17b1f233f.shortDescription': '',
        'listItems.5762b4c6-522e-4b7e-ac6c-ed28a0ee78b1.text': '',
        'listItems.5762b4c6-522e-4b7e-ac6c-ed28a0ee78b1.hint': '',
        'listItems.3dbe7ced-8489-4735-b2b4-4a0eccfab2c5.text': '',
        'components.1bd7bcad-060f-44d2-ba15-bd5f7d3efa8a.title': '',
        'components.1bd7bcad-060f-44d2-ba15-bd5f7d3efa8a.shortDescription': '',
        'components.4dd3983d-b3bd-4572-9653-6e4bc13e1f04.title':
          'Welsh decl question text',
        'components.4dd3983d-b3bd-4572-9653-6e4bc13e1f04.shortDescription':
          'Welsh decl short desc',
        'components.4dd3983d-b3bd-4572-9653-6e4bc13e1f04.content':
          'Welsh markdown text',
        'pages.a3060899-5aff-41b6-b825-fde80d360fc8.title': '',
        'components.a3060899-5aff-41b6-b825-fde80d360fc8.content': '',
        'pages.18f05ce2-a506-4878-8f5b-2642e6b2e1b0.title': '',
        'components.858f2da9-f593-4c7f-a3e5-5ee603e17eea.title': '',
        'components.858f2da9-f593-4c7f-a3e5-5ee603e17eea.hint': '',
        'components.858f2da9-f593-4c7f-a3e5-5ee603e17eea.shortDescription': '',
        'components.b9620b02-e44c-4a7b-97e1-3e9980e3cbb8.title': '',
        'components.b9620b02-e44c-4a7b-97e1-3e9980e3cbb8.hint': '',
        'components.b9620b02-e44c-4a7b-97e1-3e9980e3cbb8.shortDescription': '',
        'components.b9620b02-e44c-4a7b-97e1-3e9980e3cbb8.instructionText': '',
        'components.a47d23b3-fef7-4ced-9234-c6b95cff5e08.title': '',
        'components.a47d23b3-fef7-4ced-9234-c6b95cff5e08.hint': '',
        'components.a47d23b3-fef7-4ced-9234-c6b95cff5e08.shortDescription': '',
        'components.a47d23b3-fef7-4ced-9234-c6b95cff5e08.instructionText': '',
        'components.ff3978d6-5567-4348-82f9-6c3ecf112d5b.title': '',
        'components.ff3978d6-5567-4348-82f9-6c3ecf112d5b.hint': '',
        'components.ff3978d6-5567-4348-82f9-6c3ecf112d5b.shortDescription': '',
        'components.ff3978d6-5567-4348-82f9-6c3ecf112d5b.instructionText': '',
        'components.8ad7d38f-8f90-4104-becf-9fcfa09537b6.title':
          'Welsh long lat xx',
        'components.8ad7d38f-8f90-4104-becf-9fcfa09537b6.hint':
          'Welsh long lat hint xx',
        'components.8ad7d38f-8f90-4104-becf-9fcfa09537b6.shortDescription':
          'Welsh long lat short desc xx',
        'components.8ad7d38f-8f90-4104-becf-9fcfa09537b6.instructionText':
          'Welsh long lat instruction text xx',
        'components.cd47a9e7-1af8-4e39-8c0a-b82f8fd512f2.title': '',
        'components.cd47a9e7-1af8-4e39-8c0a-b82f8fd512f2.hint': '',
        'components.cd47a9e7-1af8-4e39-8c0a-b82f8fd512f2.shortDescription': '',
        'components.9273441f-b8a4-49ff-8fa1-a9afdeb4b2f2.title': ''
      }
    }
  },
  options: {
    showReferenceNumber: true,
    disableUserFeedback: false
  }
}

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
