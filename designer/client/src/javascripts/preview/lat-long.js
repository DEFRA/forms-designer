import {
  LocationQuestionDomElements,
  LocationQuestionEventListeners
} from '~/src/javascripts/preview/location-question-base.js'

/**
 * @implements {QuestionElements}
 */
export class LatLongDomElements extends LocationQuestionDomElements {}

export class LatLongEventListeners extends LocationQuestionEventListeners {}

/**
 * @import { ListenerRow, LocationSettings, QuestionElements, LatLongQuestion } from '@defra/forms-model'
 */
