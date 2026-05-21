import { hasComponentsEvenIfNoNext } from '@defra/forms-model'
import Boom from '@hapi/boom'

import { buildErrorList } from '~/src/common/helpers/build-error-details.js'
import { formsLibraryBackLink } from '~/src/models/links.js'

/**
 * @param { string } email
 * @param { ValidationFailure<{ email: string }> } [validation]
 */
export function fileViewModel(email, validation) {
  const pageTitle = 'You have a file to download'
  return {
    backLink: formsLibraryBackLink,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    field: {
      id: 'email',
      name: 'email',
      label: {
        text: 'Email address'
      },
      value: validation?.formValues.email ?? email
    },
    errorList: buildErrorList(validation?.formErrors, ['email']),
    formErrors: validation?.formErrors,
    formValues: validation?.formValues,
    buttonText: 'Download file'
  }
}

/**
 * @param {string} email
 * @param {Record<string, FormAdapterFile[]>} files
 * @param {FormDefinition} definition
 */
export function downloadAllViewModel(
  email,
  files,
  definition
) {
  const pageTitle = 'Download attached files'
  const list = Object.entries(files).flatMap(([name, fileList]) => {
    const component = getComponent(definition, name)

    return fileList.map((file) => ({
      key: {
        text: file.fileName
      },
      value: {
        html:
          component.title +
          ` <strong id="downloaded-tag-${file.fileId}" class="govuk-tag govuk-tag--green pull-right app-hidden">Downloaded</strong>
        <strong id="downloading-tag-${file.fileId}" class="govuk-tag govuk-tag--yellow pull-right app-hidden">Downloading</strong>`
      },
      actions: {
        classes: 'app-summary-list__actions--narrow',
        items: [
          {
            href: `/file-download/${file.fileId}`,
            text: 'Download',
            visuallyHiddenText: `Download file ${file.fileName} for component ${component.title}`,
            attributes: {
              'data-fileid': file.fileId
            }
          }
        ]
      }
    }))
  })

  return {
    backLink: formsLibraryBackLink,
    pageTitle,
    pageHeading: {
      text: pageTitle,
      size: 'large'
    },
    email,
    list,
    buttonText: 'Download all files'
  }
}

/**
 * Find component by name
 * @param {FormDefinition} definition
 * @param {string} componentName
 * @returns {ComponentDef}
 * @throws {Error} If component is not found
 */
export function getComponent(definition, componentName) {
  for (const page of definition.pages) {
    if (hasComponentsEvenIfNoNext(page)) {
      const component = page.components.find(
        ({ name }) => name === componentName
      )
      if (component) {
        return component
      }
    }
  }

  throw Boom.notFound(`Component not found with name '${componentName}'`)
}

/**
 * @import { FormDefinition, ComponentDef } from '@defra/forms-model'
 * @import { FormAdapterFile } from '@defra/forms-engine-plugin/engine/types.js'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
