import {
  ComponentType,
  controllerNameFromPath,
  ControllerType,
  hasContent,
  hasNext
} from '@defra/forms-model'

import { findPathsTo } from '~/src/data/page/findPathsTo.js'

/**
 * @template {unknown[]} ArrayType
 * @param {ArrayType} arr
 * @param {number} from
 * @param {number} to
 */
export function arrayMove(arr, from, to) {
  const elm = arr.splice(from, 1)[0]
  arr.splice(to, 0, elm)
  return arr
}

/**
 * Create filter for allowed components
 * @param {Partial<Page>} page
 */
export function isComponentAllowed(page) {
  const controller = controllerNameFromPath(page.controller)

  /**
   * Filter allowed components for current page
   * @param {ComponentDef} component
   */
  return (component) => {
    const isContent = hasContent(component)

    // File upload components not allowed on question pages
    const isQuestion =
      component.type !== ComponentType.FileUploadField &&
      (!controller || controller === ControllerType.Page)

    // File upload pages can have a single file upload form component
    const isFileUpload =
      component.type === ComponentType.FileUploadField &&
      controller === ControllerType.FileUpload

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
  const { pages } = data

  // Check if we already have a start page
  const hasStartPage = pages.some(({ controller }) => {
    return controllerNameFromPath(controller) === ControllerType.Start
  })

  // Check if we already have a summary page
  const hasSummaryPage = pages.some(({ controller }) => {
    return controllerNameFromPath(controller) === ControllerType.Summary
  })

  // Check if we have a link from another page
  const hasLinkFrom = findPathsTo(data, page.path).length > 1
  const hasLinkTo = hasNext(page) && !!page.next.length

  /**
   * Filter allowed page types for current page
   * @param {Page} pageType
   */
  return (pageType) => {
    /**
     * Start page unavailable when:
     *
     * 1. Another start page already exists
     * 2. Current page is linked from another page
     */
    const isStartPageHidden =
      pageType.controller === ControllerType.Start &&
      (hasStartPage || hasLinkFrom)

    /**
     * Summary page unavailable when:
     *
     * 1. Another summary page already exists
     * 2. Current page has links to another page
     */
    const isSummaryPageHidden =
      pageType.controller === ControllerType.Summary &&
      (hasSummaryPage || hasLinkTo)

    /**
     * Page types currently unavailable
     */
    const isInactivePage =
      pageType.controller === ControllerType.FileUpload ||
      pageType.controller === ControllerType.Status

    /**
     * Ignore rules when already selected
     */
    return (
      !(isStartPageHidden || isSummaryPageHidden || isInactivePage) ||
      pageType.controller === page.controller
    )
  }
}

/**
 * @import { ComponentDef, FormDefinition, Page } from '@defra/forms-model'
 */
