//import { Schema, FormDefinition } from '@defra/forms-model'
import { FormDefinition } from '@defra/forms-model'
import { type ServerRoute, type ResponseObject } from '@hapi/hapi'
import Wreck from '@hapi/wreck'

import config from '~/src/config.js'
// import { publish } from '~/src/lib/publish/index.js'

const getPublished = async function (id: string) {
  const { payload } = await Wreck.get<FormDefinition>(
    `${config.managerUrl}/forms/${id}/definition`
  )
  return payload
}

export const getFormWithId: ServerRoute = {
  // GET DATA
  method: 'GET',
  path: '/api/{id}/data',
  options: {
    async handler(request, h) {
      const { id } = request.params
      try {
        const response = await getPublished(id)
        const formJson = JSON.parse(response)

        return h.response(formJson)
      } catch (error) {
        request.logger.error(['GET /api/{id}/data', 'getFormWithId'], error)
        throw error
      }
    }
  }
}

// export const putFormWithId: ServerRoute = {
//   // SAVE DATA
//   method: 'PUT',
//   path: '/api/{id}/data',
//   options: {
//     payload: {
//       parse: true
//     },
//     async handler(request, h) {
//       const { id } = request.params
//       const { persistenceService } = request.services([])

//       try {
//         const { value, error } = Schema.validate(request.payload, {
//           abortEarly: false
//         })

//         if (error) {
//           request.logger.error(
//             ['error', `/api/${id}/data`],
//             [error, request.payload]
//           )

//           throw new Error(`Schema validation failed, reason: ${error.message}`)
//         }
//         await persistenceService.uploadConfiguration(
//           `${id}`,
//           JSON.stringify(value)
//         )
//         await publish(id, value)
//         return h.response({ ok: true }).code(204)
//       } catch (err) {
//         request.logger.error('Designer Server PUT /api/{id}/data error:', err)
//         const errorSummary = {
//           id,
//           payload: request.payload,
//           errorMessage: err.message,
//           error: err.stack
//         }
//         request.yar.set(`error-summary-${id}`, errorSummary)
//         return h.response({ ok: false, err }).code(401)
//       }
//     }
//   }
// }

export const getAllPersistedConfigurations: ServerRoute = {
  method: 'GET',
  path: '/api/configurations',
  options: {
    async handler(request, h): Promise<ResponseObject | undefined> {
      const { persistenceService } = request.services([])
      try {
        const response = await persistenceService.listAllConfigurations()
        return h.response(response).type('application/json')
      } catch (error) {
        request.server.log(['error', '/configurations'], error)
      }
    }
  }
}

export const log: ServerRoute = {
  method: 'POST',
  path: '/api/log',
  options: {
    handler(request, h): ResponseObject | undefined {
      try {
        request.server.log(request.payload.toString())
        return h.response({ ok: true }).code(204)
      } catch (error) {
        request.server.error(request.payload.toString())
        return h.response({ ok: false }).code(500)
      }
    }
  }
}
