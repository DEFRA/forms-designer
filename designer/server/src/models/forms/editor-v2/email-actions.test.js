import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  NO_CONDITION_TEXT,
  buildConditionItems,
  buildDefaultEmail,
  buildOutputRows,
  emailActionsViewModel,
  formatDescription,
  getConditionName,
  resolveFormValues
} from '~/src/models/forms/editor-v2/email-actions.js'

const conditionId = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'

const definitionWithOutputs = buildDefinition({
  ...testFormDefinitionWithMultipleV2Conditions,
  outputs: [
    {
      emailAddress: 'unconditional@defra.gov.uk',
      audience: 'human',
      version: '1'
    },
    {
      emailAddress: 'conditional@defra.gov.uk',
      audience: 'machine',
      version: '1',
      condition: conditionId
    }
  ]
})

describe('email actions view model', () => {
  describe('formatDescription', () => {
    test('should describe human-readable output', () => {
      expect(formatDescription('human', '1')).toBe('Human-readable')
    })

    test('should describe machine-readable output with its version', () => {
      expect(formatDescription('machine', '2')).toBe(
        'Machine-readable (version 2)'
      )
    })
  })

  describe('buildDefaultEmail', () => {
    test('should default to human-readable when the definition has no output', () => {
      expect(buildDefaultEmail(testFormMetadata, buildDefinition({}))).toEqual({
        emailAddress: undefined,
        format: 'Human-readable',
        changeHref: '/library/my-form-slug/edit/notification-email'
      })
    })

    test('should use the metadata email and the definition output format', () => {
      expect(
        buildDefaultEmail(
          { ...testFormMetadata, notificationEmail: 'notify@defra.gov.uk' },
          buildDefinition({ output: { audience: 'machine', version: '1' } })
        )
      ).toEqual({
        emailAddress: 'notify@defra.gov.uk',
        format: 'Machine-readable (version 1)',
        changeHref: '/library/my-form-slug/edit/notification-email'
      })
    })
  })

  describe('getConditionName', () => {
    test('should fall back to every submission when there is no condition', () => {
      expect(getConditionName(definitionWithOutputs, undefined)).toBe(
        NO_CONDITION_TEXT
      )
    })

    test('should fall back to every submission when the condition is missing', () => {
      expect(getConditionName(definitionWithOutputs, 'not-a-condition')).toBe(
        NO_CONDITION_TEXT
      )
    })

    test('should return the condition display name', () => {
      expect(getConditionName(definitionWithOutputs, conditionId)).toBe(
        'isBobV2'
      )
    })
  })

  describe('buildConditionItems', () => {
    test('should list every submission first and select it by default', () => {
      const items = buildConditionItems(definitionWithOutputs)

      expect(items[0]).toEqual({
        text: NO_CONDITION_TEXT,
        value: '',
        selected: true
      })
      expect(items.length).toBeGreaterThan(1)
    })

    test('should select the supplied condition', () => {
      const items = buildConditionItems(definitionWithOutputs, conditionId)

      expect(items[0].selected).toBe(false)
      expect(items.find((item) => item.value === conditionId)?.selected).toBe(
        true
      )
    })
  })

  describe('buildOutputRows', () => {
    test('should return no rows when there are no outputs', () => {
      expect(buildOutputRows('my-form-slug', buildDefinition({}))).toEqual([])
    })

    test('should list each output with its condition, format and actions', () => {
      const rows = buildOutputRows('my-form-slug', definitionWithOutputs)

      expect(rows).toHaveLength(2)

      expect(rows[0][0]).toEqual({ text: 'unconditional@defra.gov.uk' })
      expect(rows[0][1]).toEqual({ text: NO_CONDITION_TEXT })
      expect(rows[0][2]).toEqual({ text: 'Human-readable' })
      expect(rows[0][3].html).toContain(
        'href="/library/my-form-slug/editor-v2/email-actions/0"'
      )
      expect(rows[0][3].html).toContain(
        'action="/library/my-form-slug/editor-v2/email-actions/0/remove"'
      )

      expect(rows[1][1]).toEqual({ text: 'isBobV2' })
      expect(rows[1][2]).toEqual({ text: 'Machine-readable (version 1)' })
    })
  })

  describe('resolveFormValues', () => {
    test('should return empty defaults when adding', () => {
      expect(resolveFormValues(definitionWithOutputs)).toEqual({
        condition: '',
        emailAddress: '',
        audience: 'human',
        machineVersion: '2'
      })
    })

    test('should return the output being amended', () => {
      expect(resolveFormValues(definitionWithOutputs, 1)).toEqual({
        condition: conditionId,
        emailAddress: 'conditional@defra.gov.uk',
        audience: 'machine',
        machineVersion: '1'
      })
    })

    test('should prefer the submitted values', () => {
      expect(
        resolveFormValues(definitionWithOutputs, 1, {
          emailAddress: 'typo@defra.gov.uk',
          audience: 'human'
        })
      ).toEqual({
        condition: conditionId,
        emailAddress: 'typo@defra.gov.uk',
        audience: 'human',
        machineVersion: '1'
      })
    })
  })

  describe('emailActionsViewModel', () => {
    test('should build the add state', () => {
      const model = emailActionsViewModel(
        testFormMetadata,
        definitionWithOutputs
      )

      expect(model.pageTitle).toBe('Email actions - Test form')
      expect(model.backLink).toEqual({
        href: '/library/my-form-slug/editor-v2/advanced-settings',
        text: 'Back to advanced settings'
      })
      expect(model.isEditing).toBe(false)
      expect(model.addFormHeading).toBe('Add a new email address')
      expect(model.buttonText).toBe('Save new email address')
      expect(model.formAction).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )
      expect(model.atLimit).toBe(false)
      expect(model.conditionsManagerHref).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
      expect(model.outputsTable.rows).toHaveLength(2)
    })

    test('should build the amend state', () => {
      const model = emailActionsViewModel(
        testFormMetadata,
        definitionWithOutputs,
        { editIndex: 1 }
      )

      expect(model.isEditing).toBe(true)
      expect(model.addFormHeading).toBe('Change email address')
      expect(model.buttonText).toBe('Save changes')
      expect(model.formAction).toBe(
        '/library/my-form-slug/editor-v2/email-actions/1'
      )
      expect(model.formValues.emailAddress).toBe('conditional@defra.gov.uk')
    })

    test('should surface validation errors', () => {
      const model = emailActionsViewModel(
        testFormMetadata,
        definitionWithOutputs,
        {
          validation: {
            formValues: {
              condition: '',
              emailAddress: 'nope',
              audience: 'human'
            },
            formErrors: {
              emailAddress: {
                text: 'Enter an email address in the correct format, like name@example.gov.uk',
                href: '#emailAddress'
              }
            }
          }
        }
      )

      expect(model.errorList).toEqual([
        {
          text: 'Enter an email address in the correct format, like name@example.gov.uk',
          href: '#emailAddress'
        }
      ])
      expect(model.formValues.emailAddress).toBe('nope')
    })

    test('should block adding once the limit is reached', () => {
      const outputs = Array.from({ length: 20 }, (_ignore, index) => ({
        emailAddress: `inbox-${index}@defra.gov.uk`,
        audience: /** @type {const} */ ('human'),
        version: '1'
      }))

      const model = emailActionsViewModel(
        testFormMetadata,
        buildDefinition({ outputs })
      )

      expect(model.atLimit).toBe(true)
    })

    test('should still allow an amend at the limit', () => {
      const outputs = Array.from({ length: 20 }, (_ignore, index) => ({
        emailAddress: `inbox-${index}@defra.gov.uk`,
        audience: /** @type {const} */ ('human'),
        version: '1'
      }))

      const model = emailActionsViewModel(
        testFormMetadata,
        buildDefinition({ outputs }),
        { editIndex: 0 }
      )

      expect(model.atLimit).toBe(false)
    })
  })
})
