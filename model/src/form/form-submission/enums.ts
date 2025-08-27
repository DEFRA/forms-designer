export const securityQuestions = [
  {
    text: 'What is a memorable place you have visited?',
    value: 'memorable-place'
  },
  {
    text: 'What is the name of your favourite character from a story or TV show?',
    value: 'character-name'
  },
  {
    text: 'What album or song to you always recommend to others?',
    value: 'audio-recommendation'
  }
]

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
