import { getPageFromDefinition, hasRepeater } from '@defra/forms-model'
import Boom from '@hapi/boom'
import Joi from 'joi'

import {
  getFormDefinitionVersion,
  getLiveFormDefinition
} from '~/src/lib/forms.js'
import { getComponentFromDefinition } from '~/src/lib/utils.js'
import { getSubmissionRecord } from '~/src/services/formSubmissionService.js'

export default [
  /**
   * @satisfies {ServerRoute<{ Params: { referenceNumber: string, pageId: string, componentId: string } }>}
   */
  ({
    method: 'GET',
    path: '/submission/{referenceNumber}/map-review/{pageId}/{componentId}',
    async handler(request, h) {
      const { params, auth } = request
      const { referenceNumber, pageId, componentId } = params
      const { token } = auth.credentials

      const record = await getSubmissionRecord(referenceNumber, token)
      const { formId, versionMetadata } = record.meta
      const definition = versionMetadata
        ? await getFormDefinitionVersion(
            formId,
            versionMetadata.versionNumber,
            token
          )
        : await getLiveFormDefinition(formId, token)
      const page = getPageFromDefinition(definition, pageId)
      const component = getComponentFromDefinition(
        definition,
        pageId,
        componentId
      )

      if (!component) {
        return Boom.notFound(
          `Component ${componentId} for map review not found`
        )
      }

      const componentName = component.name
      const repeaterName = hasRepeater(page) ? page.repeat.options.name : ''

      const geojson = /** @type {FeatureCollection[]} */ (
        repeaterName
          ? record.data.repeaters[repeaterName].map(
              (item) => item[componentName]
            )
          : [record.data.main[componentName]]
      )

      const caption = referenceNumber
      const pageTitle = `${component.title}${repeaterName ? ' (multiple responses)' : ''}`

      return h.view('submission/map', {
        pageTitle,
        caption,
        pageHeading: pageTitle,
        referenceNumber,
        repeaterName,
        component,
        geojson
      })
    },
    options: {
      auth: {
        access: {
          entity: 'user',
          scope: false
        }
      },
      validate: {
        params: Joi.object()
          .keys({
            referenceNumber: Joi.string().required(),
            pageId: Joi.string().uuid().required(),
            componentId: Joi.string().uuid().required()
          })
          .required()
      }
    }
  })
]

/**
 * @import { FeatureCollection } from '@defra/forms-engine-plugin/engine/types.js'
 */

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
