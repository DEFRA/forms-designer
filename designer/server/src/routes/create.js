import { sessionNames } from '~/src/common/constants/session-names.js'
import * as create from '~/src/models/create.js'

export default [
  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create',
    handler(request, h) {
      return h.redirect('/create/title').permanent()
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/title',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'question-input',
        create.titleViewModel(metadata, validation)
      )
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/organisation',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'question-radios',
        create.organisationViewModel(metadata, validation)
      )
    }
  }),

  /**
   * @satisfies {ServerRoute}
   */
  ({
    method: 'GET',
    path: '/create/team',
    handler(request, h) {
      const { yar } = request

      // Form metadata, validation errors
      const metadata = yar.get(sessionNames.create)
      const validation = yar.flash(sessionNames.validationFailure).at(0)

      return h.view(
        'question-inputs',
        create.teamViewModel(metadata, validation)
      )
    }
  })
]

/**
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 */

/**
 * @template {import('@hapi/hapi').ReqRef} [ReqRef=import('@hapi/hapi').ReqRefDefaults]
 * @typedef {import('@hapi/hapi').ServerRoute<ReqRef>} ServerRoute
 */
