import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  reusePreviousAnswersFields,
  reusePreviousAnswersViewModel
} from '~/src/models/forms/editor-v2/reuse-previous-answers.js'

describe('reuse previous answers view model', () => {
  test('should return the correct view model', () => {
    const result = reusePreviousAnswersViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    expect(result).toEqual({
      backLink: {
        href: '/library/my-form-slug/editor-v2/advanced-settings',
        text: 'Back to advanced settings'
      },
      navigation: expect.any(Object),
      pageTitle:
        'Can people reuse answers from a previous submission? - Test form',
      pageHeading: {
        text: 'Can people reuse answers from a previous submission?',
        size: 'large'
      },
      pageCaption: {
        text: 'Test form'
      },
      useNewMasthead: true,
      errorList: [],
      fields: expect.any(Object),
      buttonText: 'Save and continue'
    })
  })

  test('should default the radios to No', () => {
    const { fields } = reusePreviousAnswersViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly
    )

    expect(fields.reusePreviousAnswers.value).toBe('false')
  })

  test.each([
    { allowCopy: true, expected: 'true' },
    { allowCopy: false, expected: 'false' }
  ])(
    'should select $expected when metadata.options.allowCopy is $allowCopy',
    ({ allowCopy, expected }) => {
      const { fields } = reusePreviousAnswersViewModel(testFormMetadata, {
        ...testFormDefinitionWithSummaryOnly,
        metadata: { options: { allowCopy } }
      })

      expect(fields.reusePreviousAnswers.value).toBe(expected)
    }
  )

  test('should include validation errors', () => {
    const validation = {
      formErrors: {
        reusePreviousAnswers: {
          text: 'Select whether people can reuse answers from a previous submission',
          href: '#reusePreviousAnswers'
        }
      },
      formValues: /** @type {FormEditor} */ ({})
    }

    const { errorList, fields } = reusePreviousAnswersViewModel(
      testFormMetadata,
      testFormDefinitionWithSummaryOnly,
      validation
    )

    expect(errorList).toEqual([
      {
        text: 'Select whether people can reuse answers from a previous submission',
        href: '#reusePreviousAnswers'
      }
    ])
    expect(fields.reusePreviousAnswers.errorMessage).toEqual({
      text: 'Select whether people can reuse answers from a previous submission'
    })
  })
})

describe('reusePreviousAnswersFields', () => {
  test('should build inline yes/no radios', () => {
    const { reusePreviousAnswers } = reusePreviousAnswersFields(false)

    expect(reusePreviousAnswers).toEqual({
      name: 'reusePreviousAnswers',
      idPrefix: 'reusePreviousAnswers',
      classes: 'govuk-radios--inline',
      fieldset: {
        legend: {
          text: 'Can people reuse answers from a previous submission?',
          classes: 'govuk-visually-hidden'
        }
      },
      hint: {
        text: 'Use when people often submit this form more than once with similar answers.'
      },
      value: 'false',
      items: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' }
      ]
    })
  })

  test('should select Yes when the setting is on', () => {
    const { reusePreviousAnswers } = reusePreviousAnswersFields(true)

    expect(reusePreviousAnswers.value).toBe('true')
  })
})

/**
 * @import { FormEditor } from '@defra/forms-model'
 */
