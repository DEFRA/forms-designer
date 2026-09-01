export enum SecurityQuestionsEnum {
  MemorablePlace = 'memorable-place',
  CharacterName = 'character-name',
  AudioRecommendation = 'audio-recommendation'
}

export enum SubmissionEventMessageSchemaVersion {
  V1 = 1
}

export enum SubmissionEventMessageCategory {
  RUNNER = 'RUNNER'
}

export enum SubmissionEventMessageSource {
  FORMS_RUNNER = 'FORMS_RUNNER'
}

export enum SubmissionEventMessageType {
  RUNNER_SAVE_AND_EXIT = 'RUNNER_SAVE_AND_EXIT'
}

/**
 * The outcome of evaluating a single form condition.
 *
 * `Error` is deliberately distinct from `False`. The runner defaults a failed
 * evaluation to `false` when routing, but for an audit record the two are not
 * the same thing and a consumer must be able to tell them apart.
 */
export enum ConditionEvaluationOutcome {
  /**
   * The condition evaluated to `true`
   */
  True = 'true',

  /**
   * The condition evaluated to `false`
   */
  False = 'false',

  /**
   * Evaluation threw - most commonly because the condition references a
   * component that is absent from the evaluation context, such as a component
   * on a repeater page. The runner treats this as `false`.
   */
  Error = 'error'
}
