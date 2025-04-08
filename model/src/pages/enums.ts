export enum ControllerPath {
  Start = '/start',
  Summary = '/summary',
  Status = '/status'
}

export enum ControllerType {
  Start = 'StartPageController',
  Page = 'PageController',
  Repeat = 'RepeatPageController',
  FileUpload = 'FileUploadPageController',
  Terminal = 'TerminalPageController',
  Summary = 'SummaryPageController',
  Status = 'StatusPageController'
}

export enum ApiErrorFunctionCode {
  General = 'General',
  DuplicatePagePathPage = 'DuplicatePagePathPage',
  DuplicatePagePathQuestion = 'DuplicatePagePathQuestion'
}
