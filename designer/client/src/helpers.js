import {
  ComponentType,
  ControllerType,
  Engine,
  controllerNameFromPath,
  hasComponents,
  hasContent,
  hasFormComponents,
  hasFormField,
  hasNext,
  isSummaryPage
} from '@defra/forms-model'

import { findPathsTo } from '~/src/data/page/findPathsTo.js'

/**
 * @template {unknown[]} ArrayType
 * @param {ArrayType} input - Input array
 * @param {number} from - Index to move from
 * @param {number} to - Index to move to
 */
export function arrayMove(input, from, to) {
  const output = structuredClone(input)
  const item = output.at(from)

  if (to < 0) {
    to = output.length - 1
  } else {
    to = to < output.length ? to : 0
  }

  // Check for moves
  if (item && from !== to) {
    output.splice(from, 1)
    output.splice(to, 0, item)
  }

  return output
}

/**
 * Create filter for allowed components
 * @param {Partial<Page>} page
 */
export function isComponentAllowed(page) {
  const components = hasComponents(page) ? page.components : []
  const controller = controllerNameFromPath(page.controller)

  // Check for existing file upload components
  const hasFileUpload = components.some(
    (c) => c.type === ComponentType.FileUploadField
  )

  /**
   * Filter allowed components for current page
   * @param {ComponentDef} component
   */
  return (component) => {
    const isContent = hasContent(component)

    // File upload components not allowed on question pages
    const isQuestion =
      component.type !== ComponentType.FileUploadField &&
      (!controller ||
        controller === ControllerType.Page ||
        controller === ControllerType.Repeat)

    // File upload pages can have a single file upload form component
    const isFileUpload =
      component.type === ComponentType.FileUploadField &&
      controller === ControllerType.FileUpload &&
      !hasFileUpload

    // Content components are always allowed
    return isContent || isQuestion || isFileUpload
  }
}

/**
 * Create filter for allowed page types
 * @param {FormDefinition} data
 * @param {Partial<Page>} page
 */
export function isControllerAllowed(data, page) {
  const { engine, pages } = data

  // Check if we already have a start page
  const hasStartPage = pages.some(({ controller }) => {
    return controllerNameFromPath(controller) === ControllerType.Start
  })

  // Check if we already have a summary page
  const hasSummaryPage = pages.some(({ controller }) => {
    return isSummaryPage(
      /** @type {Page} */ ({ controller: controllerNameFromPath(controller) })
    )
  })

  // Check if we have a link from another page
  const hasLinkFrom = findPathsTo(data, page.path).length > 1
  const hasLinkTo = hasNext(page) && !!page.next.length

  /**
   * Start page unavailable when:
   *
   * 1. Another start page already exists
   * 2. Current page is linked from another page
   * @param {Page} pageType
   */
  const isStartPageHidden = (pageType) => {
    return (
      pageType.controller === ControllerType.Start &&
      (hasStartPage || hasLinkFrom)
    )
  }

  /**
   * Summary page unavailable when:
   *
   * 1. Another summary page already exists
   * 2. Current page has links to another page
   * @param {Page} pageType
   */
  const isSummaryPageHidden = (pageType) => {
    return isSummaryPage(pageType) && (hasSummaryPage || hasLinkTo)
  }

  /**
   * Terminal page unavailable when:
   *
   * 1. Engine is not V2
   * 2. Current page has form components
   * @param {Page} pageType
   */
  const isTerminalPageHidden = (pageType) => {
    return (
      pageType.controller === ControllerType.Terminal &&
      (engine !== Engine.V2 ||
        (hasFormComponents(page) && page.components.some(hasFormField)))
    )
  }

  /**
   * Page types currently unavailable
   * @param {Page} pageType
   */
  const isInactivePage = (pageType) => {
    return pageType.controller === ControllerType.Status
  }

  /**
   * Filter allowed page types for current page
   * @param {Page} pageType
   */
  return (pageType) => {
    /**
     * Ignore rules when already selected
     */
    return (
      !(
        isStartPageHidden(pageType) ||
        isSummaryPageHidden(pageType) ||
        isTerminalPageHidden(pageType) ||
        isInactivePage(pageType)
      ) || pageType.controller === page.controller
    )
  }
}

/**
 * @import { ComponentDef, FormDefinition, Page } from '@defra/forms-model'
 */
