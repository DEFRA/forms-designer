import {
  findExclusiveItemIndex,
  getAdditionalQuestion,
  isExclusiveItem
} from '~/src/form/form-definition/extensions.js'

export const EXCLUSIVE_DIVIDER_TEXT = 'or'

/**
 * Builds the govukInput parameters for the short answer question revealed by
 * the exclusive option. The designer preview renders this itself rather than
 * relying on the checkboxes component, so it stays visible while the author is
 * editing it.
 * @param {AdditionalQuestion} additionalQuestion
 * @param {string} highlightClasses
 * @returns {AdditionalQuestionPreview}
 */
export function additionalQuestionToPreview(
  additionalQuestion,
  highlightClasses = ''
) {
  const hint = additionalQuestion.hint
    ? {
        hint: {
          text: additionalQuestion.hint,
          classes: ''
        }
      }
    : {}

  return /** @type {AdditionalQuestionPreview} */ ({
    id: additionalQuestion.id,
    name: additionalQuestion.name,
    label: {
      text: additionalQuestion.title.length
        ? additionalQuestion.title
        : 'Additional question',
      classes: highlightClasses
    },
    ...hint,
    classes: 'govuk-!-width-two-thirds'
  })
}

/**
 * Adds the exclusive behaviour, the "or" divider and the revealed question to
 * a preview item list. Lists without an exclusive item are returned untouched,
 * which is what every list written before this feature looks like.
 * @param {ListItemReadonly[]} items
 * @param {(id: string) => string} [getHighlight]
 * @returns {ListItemOrDivider[]}
 */
export function applyExclusiveBehaviour(items, getHighlight) {
  const exclusiveIndex = findExclusiveItemIndex(items)

  if (exclusiveIndex === -1) {
    return items
  }

  const decorated = items.map((item) => {
    if (!isExclusiveItem(item)) {
      return item
    }

    const additionalQuestion = getAdditionalQuestion(item)

    return {
      ...item,
      behaviour: 'exclusive',
      ...(additionalQuestion
        ? {
            additionalQuestion: additionalQuestionToPreview(
              additionalQuestion,
              getHighlight ? getHighlight(`${item.id}-additional-question`) : ''
            )
          }
        : {})
    }
  })

  // A single item list has nothing to divide it from
  if (decorated.length < 2) {
    return /** @type {ListItemOrDivider[]} */ (decorated)
  }

  const divider = /** @type {ListDivider} */ ({
    divider: EXCLUSIVE_DIVIDER_TEXT
  })

  if (exclusiveIndex === 0) {
    const [exclusive, ...rest] = decorated
    return /** @type {ListItemOrDivider[]} */ ([exclusive, divider, ...rest])
  }

  const rest = decorated.slice(0, exclusiveIndex)
  const after = decorated.slice(exclusiveIndex)

  return /** @type {ListItemOrDivider[]} */ ([...rest, divider, ...after])
}

/**
 * @import { AdditionalQuestion } from '~/src/form/form-definition/types.js'
 * @import { AdditionalQuestionPreview, ListDivider, ListItemOrDivider, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
