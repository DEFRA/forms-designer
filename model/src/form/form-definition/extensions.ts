import {
  ExtensionType,
  type AdditionalQuestion,
  type Exclusive,
  type Extension,
  type Item,
  type List
} from '~/src/form/form-definition/types.js'

/**
 * Separator between a component name and the name of a question nested
 * inside it. Shared with the composite fields (address, date) in the runner.
 */
export const ADDITIONAL_QUESTION_SEPARATOR = '__'

/**
 * The extension types that make up the exclusive option, removed together when
 * the author moves it to another item.
 */
const EXCLUSIVE_EXTENSION_TYPES: ExtensionType[] = [
  ExtensionType.Exclusive,
  ExtensionType.AdditionalQuestion
]

/**
 * Every extension attached to a list item, or an empty array for the items in
 * definitions written before extensions existed.
 * @param {Partial<Item> | undefined} item
 * @returns {Extension[]}
 */
export function getItemExtensions(item?: Partial<Item>): Extension[] {
  return item?.extensions ?? []
}

/**
 * Whether the item is the "none of the above" style option for its list.
 * @param {Partial<Item> | undefined} item
 */
export function isExclusiveItem(item?: Partial<Item>): boolean {
  return getItemExtensions(item).some(
    (extension) => extension.type === ExtensionType.Exclusive
  )
}

/**
 * The exclusive extension attached to an item, if any.
 * @param {Partial<Item> | undefined} item
 */
export function getExclusiveExtension(
  item?: Partial<Item>
): Exclusive | undefined {
  return getItemExtensions(item).find(
    (extension): extension is Exclusive =>
      extension.type === ExtensionType.Exclusive
  )
}

/**
 * The additional question revealed when the item is selected, if any.
 * @param {Partial<Item> | undefined} item
 */
export function getAdditionalQuestion(
  item?: Partial<Item>
): AdditionalQuestion | undefined {
  return getItemExtensions(item).find(
    (extension): extension is AdditionalQuestion =>
      extension.type === ExtensionType.AdditionalQuestion
  )
}

/**
 * Whether the item reveals an additional question when selected.
 * @param {Partial<Item> | undefined} item
 */
export function hasAdditionalQuestion(item?: Partial<Item>): boolean {
  return getAdditionalQuestion(item) !== undefined
}

/**
 * The exclusive item of a list, if one has been marked.
 * @param {Partial<Item>[] | undefined} items
 */
export function findExclusiveItem<ItemType extends Partial<Item>>(
  items?: ItemType[]
): ItemType | undefined {
  return items?.find((item) => isExclusiveItem(item))
}

/**
 * The index of the exclusive item of a list, or -1 when there is none.
 * @param {Partial<Item>[] | undefined} items
 */
export function findExclusiveItemIndex(items?: Partial<Item>[]): number {
  return items?.findIndex((item) => isExclusiveItem(item)) ?? -1
}

/**
 * Where in the list the exclusive item sits. The "or" divider is rendered on
 * the inside edge of the exclusive item, so the runner and the designer
 * preview both need to know which end it is at.
 * @param {Partial<Item>[] | undefined} items
 */
export function getExclusivePosition(
  items?: Partial<Item>[]
): 'first' | 'last' | undefined {
  const index = findExclusiveItemIndex(items)

  if (index === -1 || !items?.length) {
    return undefined
  }

  return index === 0 ? 'first' : 'last'
}

/**
 * The additional question of a list, if one has been attached to its exclusive
 * item.
 * @param {Partial<Item>[] | undefined} items
 */
export function findAdditionalQuestion(
  items?: Partial<Item>[]
): AdditionalQuestion | undefined {
  return getAdditionalQuestion(findExclusiveItem(items))
}

/**
 * The form state key an additional question's answer is held under. Prefixing
 * with the component name keeps it unique across the form without asking the
 * author to think about collisions.
 * @param {string} componentName
 * @param {AdditionalQuestion | string} additionalQuestion
 */
export function getAdditionalQuestionName(
  componentName: string,
  additionalQuestion: AdditionalQuestion | string
): string {
  const name =
    typeof additionalQuestion === 'string'
      ? additionalQuestion
      : additionalQuestion.name

  return `${componentName}${ADDITIONAL_QUESTION_SEPARATOR}${name}`
}

/**
 * Replaces the extensions on an item, dropping the property entirely when
 * there are none so definitions stay free of empty arrays.
 * @param item - the item to replace the extensions on
 * @param extensions - the extensions to attach
 */
export function withExtensions<ItemType extends Partial<Item>>(
  item: ItemType,
  extensions: Extension[]
): ItemType {
  const { extensions: _existing, ...rest } = item

  if (!extensions.length) {
    return rest as ItemType
  }

  return { ...rest, extensions } as ItemType
}

/**
 * Removes every exclusive and additional question extension from a list of
 * items, leaving any other extensions in place. Used when the author moves the
 * exclusive option, so only one item ever holds it.
 * @param items - the items to clear the extensions from
 */
export function clearExclusiveExtensions<ItemType extends Partial<Item>>(
  items: ItemType[]
): ItemType[] {
  return items.map((item) =>
    withExtensions(
      item,
      getItemExtensions(item).filter(
        (extension) => !EXCLUSIVE_EXTENSION_TYPES.includes(extension.type)
      )
    )
  )
}

/**
 * Whether a list is one the runner has to apply exclusive behaviour to.
 * @param {Pick<List, 'items'> | undefined} list
 */
export function hasExclusiveItem(list?: Pick<List, 'items'>): boolean {
  return findExclusiveItem(list?.items) !== undefined
}
