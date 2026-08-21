import { type FormOutputChanges } from '~/src/form/form-audit/types.js'
import { type Output } from '~/src/form/form-definition/types.js'

/**
 * Identifies a submission email target by its stored values. Unlike
 * `getOutputKey`, which decides whether two outputs are duplicates of one
 * another, this comparison is exact - changing only the case of an address is
 * still a change worth recording against the form.
 * @param output - submission email target
 */
function getComparisonKey(output: Output): string {
  return JSON.stringify([
    output.emailAddress,
    output.audience,
    output.version,
    output.condition ?? ''
  ])
}

interface PositionedOutput {
  output: Output
  index: number
}

/**
 * Works out what changed between two sets of submission email targets, in the
 * shape the audit record expects.
 *
 * Outputs carry no id of their own, so an amendment cannot be spotted directly.
 * An entry that disappears from a position while another appears at that same
 * position is treated as an amendment rather than as an unrelated removal and
 * addition - which is what the editor does when an author changes an existing
 * email action. Anything left over is reported as a plain addition or removal,
 * so a wholesale replacement (a JSON upload, say) still records honestly.
 * @param previous - outputs before the update
 * @param next - outputs after the update
 * @returns the changes, or undefined when the outputs are untouched
 */
export function getFormOutputChanges(
  previous: Output[] | undefined,
  next: Output[] | undefined
): FormOutputChanges | undefined {
  const previousOutputs = previous ?? []
  const nextOutputs = next ?? []

  const previousKeys = new Set(previousOutputs.map(getComparisonKey))
  const nextKeys = new Set(nextOutputs.map(getComparisonKey))

  const position = (output: Output, index: number): PositionedOutput => ({
    output,
    index
  })

  const removed: PositionedOutput[] = previousOutputs
    .map((out, idx) => position(out, idx))
    .filter(({ output }) => !nextKeys.has(getComparisonKey(output)))

  const added: PositionedOutput[] = nextOutputs
    .map((out, idx) => position(out, idx))
    .filter(({ output }) => !previousKeys.has(getComparisonKey(output)))

  const updated = removed.flatMap((before) => {
    const after = added.find(({ index }) => index === before.index)

    if (!after) {
      return []
    }

    return [{ previous: before.output, new: after.output }]
  })

  const pureAdditions = added
    .filter(({ index }) => !removed.some((before) => before.index === index))
    .map(({ output }) => output)

  const pureRemovals = removed
    .filter(({ index }) => !added.some((after) => after.index === index))
    .map(({ output }) => output)

  const changes: FormOutputChanges = {}

  if (pureAdditions.length) {
    changes.added = pureAdditions
  }

  if (updated.length) {
    changes.updated = updated
  }

  if (pureRemovals.length) {
    changes.removed = pureRemovals
  }

  return Object.keys(changes).length ? changes : undefined
}
