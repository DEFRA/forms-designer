import api from '~/src/routes/forms/api.js'
import contactEmail from '~/src/routes/forms/contact/email.js'
import contactOnline from '~/src/routes/forms/contact/online.js'
import contactPhone from '~/src/routes/forms/contact/phone.js'
import create from '~/src/routes/forms/create.js'
import edit from '~/src/routes/forms/edit.js'
import editorCheckAnswersSettings from '~/src/routes/forms/editor-v2/check-answers-settings.js'
import editorGuidance from '~/src/routes/forms/editor-v2/guidance.js'
import editorMigrate from '~/src/routes/forms/editor-v2/migrate.js'
import editorPage from '~/src/routes/forms/editor-v2/page.js'
import editorPagesReorder from '~/src/routes/forms/editor-v2/pages-reorder.js'
import editorPages from '~/src/routes/forms/editor-v2/pages.js'
import editorQuestionDelete from '~/src/routes/forms/editor-v2/question-delete.js'
import editorQuestionDetails from '~/src/routes/forms/editor-v2/question-details.js'
import editorQuestion from '~/src/routes/forms/editor-v2/question-type.js'
import editorQuestions from '~/src/routes/forms/editor-v2/questions.js'
import formLifecycle from '~/src/routes/forms/form-lifecycle.js'
import library from '~/src/routes/forms/library.js'
import notificationEmail from '~/src/routes/forms/notification-email.js'
import privacyNotice from '~/src/routes/forms/privacy-notice.js'
import submissionGuidance from '~/src/routes/forms/submission-guidance.js'

export default [
  api,
  create,
  edit,
  editorMigrate,
  editorGuidance,
  editorPages,
  editorPagesReorder,
  editorPage,
  editorQuestion,
  editorQuestionDelete,
  editorQuestionDetails,
  editorQuestions,
  editorCheckAnswersSettings,
  library,
  formLifecycle,
  contactPhone,
  contactEmail,
  contactOnline,
  submissionGuidance,
  privacyNotice,
  notificationEmail
].flat()
