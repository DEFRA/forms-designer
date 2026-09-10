import { getFormOutputChanges } from '~/src/form/form-audit/output-changes.js'
import { type Output } from '~/src/form/form-definition/types.js'

describe('getFormOutputChanges', () => {
  const human: Output = {
    emailAddress: 'first@example.com',
    audience: 'human',
    version: '1'
  }

  const machine: Output = {
    emailAddress: 'second@example.com',
    audience: 'machine',
    version: '2'
  }

  const conditional: Output = {
    emailAddress: 'third@example.com',
    audience: 'human',
    version: '1',
    condition: 'condition-id'
  }

  it('should return undefined when neither definition has outputs', () => {
    expect(getFormOutputChanges(undefined, undefined)).toBeUndefined()
    expect(getFormOutputChanges([], [])).toBeUndefined()
    expect(getFormOutputChanges(undefined, [])).toBeUndefined()
  })

  it('should return undefined when the outputs are unchanged', () => {
    expect(
      getFormOutputChanges([human, machine], [{ ...human }, { ...machine }])
    ).toBeUndefined()
  })

  it('should report an added output', () => {
    expect(getFormOutputChanges([human], [human, conditional])).toEqual({
      added: [conditional]
    })
  })

  it('should report the first output added to a form', () => {
    expect(getFormOutputChanges(undefined, [human])).toEqual({
      added: [human]
    })
  })

  it('should report a removed output', () => {
    expect(getFormOutputChanges([human, machine], [human])).toEqual({
      removed: [machine]
    })
  })

  it('should report every output removed from a form', () => {
    expect(getFormOutputChanges([human, machine], undefined)).toEqual({
      removed: [human, machine]
    })
  })

  it('should report an amended output as an update, not a removal and an addition', () => {
    const amended: Output = { ...machine, emailAddress: 'changed@example.com' }

    expect(getFormOutputChanges([human, machine], [human, amended])).toEqual({
      updated: [{ previous: machine, new: amended }]
    })
  })

  it.each([
    ['audience', { audience: 'machine' }],
    ['version', { version: '3' }],
    ['condition', { condition: 'another-condition-id' }]
  ] as [string, Partial<Output>][])(
    'should report a change of %s as an update',
    (_field, change) => {
      const amended: Output = { ...conditional, ...change }

      expect(getFormOutputChanges([conditional], [amended])).toEqual({
        updated: [{ previous: conditional, new: amended }]
      })
    }
  )

  it('should report a condition being cleared as an update', () => {
    const cleared: Output = {
      emailAddress: conditional.emailAddress,
      audience: conditional.audience,
      version: conditional.version
    }

    expect(getFormOutputChanges([conditional], [cleared])).toEqual({
      updated: [{ previous: conditional, new: cleared }]
    })
  })

  it('should report a change of case in an email address', () => {
    const recased: Output = { ...human, emailAddress: 'First@example.com' }

    expect(getFormOutputChanges([human], [recased])).toEqual({
      updated: [{ previous: human, new: recased }]
    })
  })

  it('should report the outputs left behind when a condition is deleted', () => {
    const otherConditional: Output = {
      ...machine,
      condition: 'condition-id'
    }

    expect(
      getFormOutputChanges([human, conditional, otherConditional], [human])
    ).toEqual({
      removed: [conditional, otherConditional]
    })
  })

  it('should report an addition and a removal made together', () => {
    expect(
      getFormOutputChanges([human, machine], [machine, conditional])
    ).toEqual({
      added: [conditional],
      removed: [human]
    })
  })

  it('should not pair a removal with an addition at a different position', () => {
    expect(getFormOutputChanges([human, machine], [machine])).toEqual({
      removed: [human]
    })
  })

  it('should pair positionally when more outputs arrive than left', () => {
    expect(getFormOutputChanges([human], [machine, conditional])).toEqual({
      updated: [{ previous: human, new: machine }],
      added: [conditional]
    })
  })
})
