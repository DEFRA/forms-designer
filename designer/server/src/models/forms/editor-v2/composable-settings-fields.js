import { ComponentType } from '@defra/forms-model'

import { GOVUK_LABEL__M } from '~/src/models/forms/editor-v2/common.js'

/**
 * Fields for configuring composable component relationships
 */

export const composableSettingsFields = {
  /**
   * Checkbox to enable adding a component after the main component
   */
  addComponentAfter: {
    name: 'addComponentAfter',
    id: 'addComponentAfter',
    classes: 'govuk-checkboxes--small',
    items: [
      {
        value: 'true',
        text: 'Add additional component after this field',
        checked: false,
        hint: {
          text: 'Add instructions, guidance, or other content after this field'
        }
      }
    ]
  },

  /**
   * Select the type of component to add after
   */
  afterComponentType: {
    name: 'afterComponentType',
    id: 'afterComponentType',
    label: {
      text: 'Component type',
      classes: 'govuk-label--s'
    },
    items: [
      { value: '', text: 'Select component type' },
      { value: ComponentType.Details, text: 'Details (collapsible content)' },
      { value: ComponentType.InsetText, text: 'Inset text' },
      { value: ComponentType.Html, text: 'HTML content' },
      { value: ComponentType.Markdown, text: 'Markdown content' }
    ]
  },

  /**
   * Content for Details component
   */
  afterComponentDetailsContent: {
    name: 'afterComponentDetailsContent',
    id: 'afterComponentDetailsContent',
    label: {
      text: 'Details content',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Enter the content to display in the collapsible section. You can use markdown for formatting.'
    },
    rows: 5
  },

  /**
   * Summary text for Details component
   */
  afterComponentDetailsSummary: {
    name: 'afterComponentDetailsSummary',
    id: 'afterComponentDetailsSummary',
    label: {
      text: 'Summary text',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Text shown on the collapsible button (e.g., "How to find location details")'
    }
  },

  /**
   * Content for InsetText component
   */
  afterComponentInsetContent: {
    name: 'afterComponentInsetContent',
    id: 'afterComponentInsetContent',
    label: {
      text: 'Inset text content',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Important information to highlight to users'
    },
    rows: 3
  },

  /**
   * Content for HTML component
   */
  afterComponentHtmlContent: {
    name: 'afterComponentHtmlContent',
    id: 'afterComponentHtmlContent',
    label: {
      text: 'HTML content',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Custom HTML content (use with caution)'
    },
    rows: 5
  },

  /**
   * Content for Markdown component
   */
  afterComponentMarkdownContent: {
    name: 'afterComponentMarkdownContent',
    id: 'afterComponentMarkdownContent',
    label: {
      text: 'Markdown content',
      classes: GOVUK_LABEL__M
    },
    hint: {
      text: 'Content with markdown formatting support'
    },
    rows: 5
  }
}

/**
 * Maps form payload to component definition with composable support
 * @param {any} payload - Form payload
 * @returns {any} Component definition with after property if configured
 */
export function mapComposableSettings(payload) {
  /** @type {any} */
  const result = {}

  // Check if adding component after is enabled
  if (payload.addComponentAfter === 'true' && payload.afterComponentType) {
    /** @type {any} */
    const afterComponent = {
      type: payload.afterComponentType,
      name: `${payload.name}_after`,
      options: {}
    }

    // Configure based on component type
    switch (payload.afterComponentType) {
      case ComponentType.Details:
        afterComponent.title =
          payload.afterComponentDetailsSummary ?? 'More information'
        afterComponent.content = payload.afterComponentDetailsContent ?? ''
        break

      case ComponentType.InsetText:
        afterComponent.content = payload.afterComponentInsetContent ?? ''
        break

      case ComponentType.Html:
        afterComponent.content = payload.afterComponentHtmlContent ?? ''
        break

      case ComponentType.Markdown:
        afterComponent.content = payload.afterComponentMarkdownContent ?? ''
        break
    }

    result.after = afterComponent
  }

  return result
}

/**
 * Extract composable settings from existing component
 * @param {any} component - Component definition
 * @returns {any} Form values for composable settings
 */
export function extractComposableSettings(component) {
  /** @type {any} */
  const values = {}

  if (component.after) {
    values.addComponentAfter = 'true'
    values.afterComponentType = component.after.type

    switch (component.after.type) {
      case ComponentType.Details:
        values.afterComponentDetailsSummary = component.after.title ?? ''
        values.afterComponentDetailsContent = component.after.content ?? ''
        break

      case ComponentType.InsetText:
        values.afterComponentInsetContent = component.after.content ?? ''
        break

      case ComponentType.Html:
        values.afterComponentHtmlContent = component.after.content ?? ''
        break

      case ComponentType.Markdown:
        values.afterComponentMarkdownContent = component.after.content ?? ''
        break
    }
  }

  return values
}
