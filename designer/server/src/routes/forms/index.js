import aiClearCache from '~/src/routes/forms/ai-create/clear-cache.js'
import aiCreateMethod from '~/src/routes/forms/ai-create/method.js'
import aiCreateDescribe from '~/src/routes/forms/ai-create/describe.js'
import aiCreateReview from '~/src/routes/forms/ai-create/review.js'
import aiCreateProgress from '~/src/routes/forms/ai-create/progress.js'
import api from '~/src/routes/forms/api.js'
import contactEmail from '~/src/routes/forms/contact/email.js'
import contactOnline from '~/src/routes/forms/contact/online.js'
import contactPhone from '~/src/routes/forms/contact/phone.js'
import create from '~/src/routes/forms/create-modified.js'
import edit from '~/src/routes/forms/edit.js'
import editorCheckAnswersSettings from '~/src/routes/forms/editor-v2/check-answers-settings.js'
import editorConditionCheckChanges from '~/src/routes/forms/editor-v2/condition-check-changes.js'
import editorConditionDelete from '~/src/routes/forms/editor-v2/condition-delete.js'
import editorCondition from '~/src/routes/forms/editor-v2/condition.js'
import editorConditionsJoin from '~/src/routes/forms/editor-v2/conditions-join.js'
import editorConditions from '~/src/routes/forms/editor-v2/conditions.js'
import editorDownload from '~/src/routes/forms/editor-v2/download.js'
import editorError from '~/src/routes/forms/editor-v2/error.js'
import editorGuidance from '~/src/routes/forms/editor-v2/guidance.js'
import editorListItemDelete from '~/src/routes/forms/editor-v2/list-item-delete.js'
import editorMigrate from '~/src/routes/forms/editor-v2/migrate.js'
import editorPage from '~/src/routes/forms/editor-v2/page.js'
import editorPagesReorder from '~/src/routes/forms/editor-v2/pages-reorder.js'
import editorPages from '~/src/routes/forms/editor-v2/pages.js'
import editorQuestionDetails from '~/src/routes/forms/editor-v2/question-details.js'
import editorQuestionDelete from '~/src/routes/forms/editor-v2/question-or-page-delete.js'
import editorQuestion from '~/src/routes/forms/editor-v2/question-type.js'
import editorQuestions from '~/src/routes/forms/editor-v2/questions.js'
import editorState from '~/src/routes/forms/editor-v2/state.js'
import editorUpload from '~/src/routes/forms/editor-v2/upload.js'
import formLifecycle from '~/src/routes/forms/form-lifecycle.js'
import library from '~/src/routes/forms/library.js'
import notificationEmail from '~/src/routes/forms/notification-email.js'
import privacyNotice from '~/src/routes/forms/privacy-notice.js'
import submissionGuidance from '~/src/routes/forms/submission-guidance.js'

export default [
  api,
  create,
  aiClearCache,
  aiCreateMethod,
  aiCreateDescribe,
  aiCreateReview,
  aiCreateProgress,
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
  editorState,
  editorListItemDelete,
  editorCheckAnswersSettings,
  editorConditionCheckChanges,
  editorConditionDelete,
  editorCondition,
  editorConditions,
  editorConditionsJoin,
  editorError,
  editorUpload,
  editorDownload,
  library,
  formLifecycle,
  contactPhone,
  contactEmail,
  contactOnline,
  submissionGuidance,
  privacyNotice,
  notificationEmail
].flat()
