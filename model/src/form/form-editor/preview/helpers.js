import { ComponentType } from '~/src/components/enums.js'
import { AutocompleteListQuestion } from '~/src/form/form-editor/preview/autocomplete.js'
import { CheckboxQuestion } from '~/src/form/form-editor/preview/checkbox.js'
import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
import { DateInputQuestion } from '~/src/form/form-editor/preview/date-input.js'
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'
import { NumberOnlyQuestion } from '~/src/form/form-editor/preview/number-only.js'
import { PhoneNumberQuestion } from '~/src/form/form-editor/preview/phone-number.js'
import { RadioQuestion } from '~/src/form/form-editor/preview/radio.js'
import { SelectQuestion } from '~/src/form/form-editor/preview/select.js'
import { ShortAnswerQuestion } from '~/src/form/form-editor/preview/short-answer.js'
import { SupportingEvidenceQuestion } from '~/src/form/form-editor/preview/supporting-evidence.js'
import { UkAddressQuestion } from '~/src/form/form-editor/preview/uk-address.js'
import { YesNoQuestion } from '~/src/form/form-editor/preview/yes-no.js'
import { findDefinitionListFromComponent } from '~/src/form/utils/list.js'
import {
  ListComponentElements,
  QuestionComponentElements,
  hasContentField,
  hasInputField,
  hasListField,
  hasSelectionFields
} from '~/src/index.js'

/**
 * @type {Record<ComponentType, typeof PreviewComponent>}
 */
const InputFieldComponentDictionary = {
  [ComponentType.TextField]: ShortAnswerQuestion,
  [ComponentType.Details]: ShortAnswerQuestion,
  [ComponentType.InsetText]: ShortAnswerQuestion,
  [ComponentType.Html]: ShortAnswerQuestion,
  [ComponentType.Markdown]: Markdown,
  [ComponentType.List]: ListQuestion,
  [ComponentType.EmailAddressField]: EmailAddressQuestion,
  [ComponentType.NumberField]: NumberOnlyQuestion,
  [ComponentType.MultilineTextField]: LongAnswerQuestion,
  [ComponentType.TelephoneNumberField]: PhoneNumberQuestion,
  [ComponentType.MonthYearField]: MonthYearQuestion,
  [ComponentType.DatePartsField]: DateInputQuestion,
  [ComponentType.UkAddressField]: UkAddressQuestion,
  [ComponentType.AutocompleteField]: AutocompleteListQuestion,
  [ComponentType.RadiosField]: RadioQuestion,
  [ComponentType.CheckboxesField]: CheckboxQuestion,
  [ComponentType.SelectField]: SelectQuestion,
  [ComponentType.YesNoField]: YesNoQuestion,
  [ComponentType.FileUploadField]: SupportingEvidenceQuestion
}

/**
 * @param {QuestionRenderer} questionRenderer
 * @param {FormDefinition} definition
 * @param {boolean} hasTitle
 * @returns {(component: ComponentDef) => Question}
 */
export function mapComponentToPreviewQuestion(
  questionRenderer,
  definition,
  hasTitle
) {
  return /** @type {(component: ComponentDef) => Question} */ (
    (component) => {
      /**
       * @type {QuestionElements}
       */
      let questionElements

      if (hasSelectionFields(component) && hasListField(component)) {
        const list = findDefinitionListFromComponent(component, definition)
        questionElements = new ListComponentElements(component, list, !hasTitle)
      } else if (
        hasInputField(component) ||
        component.type === ComponentType.YesNoField
      ) {
        questionElements = new QuestionComponentElements(component, !hasTitle)
      } else if (hasContentField(component)) {
        questionElements = new ContentElements(component, !hasTitle)
      } else {
        questionElements = new ComponentElements(component, !hasTitle)
      }

      const QuestionConstructor = InputFieldComponentDictionary[component.type]

      return new QuestionConstructor(questionElements, questionRenderer)
    }
  )
}

/**
 * @import { QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
 * @import { Item, FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { FormComponentsDef, ComponentDef } from '~/src/components/types.js'
 */
