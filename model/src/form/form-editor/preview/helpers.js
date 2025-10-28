import { ComponentType } from '~/src/components/enums.js'
import {
  hasContentField,
  hasInputField,
  hasListField,
  hasSelectionFields
} from '~/src/components/helpers.js'
import { AutocompleteListQuestion } from '~/src/form/form-editor/preview/autocomplete.js'
import { CheckboxQuestion } from '~/src/form/form-editor/preview/checkbox.js'
import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
import { DateInputQuestion } from '~/src/form/form-editor/preview/date-input.js'
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import {
  ListComponentElements,
  ListQuestion,
  SelectComponentElements
} from '~/src/form/form-editor/preview/list.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'
import {
  NumberComponentPreviewElements,
  NumberOnlyQuestion
} from '~/src/form/form-editor/preview/number-only.js'
import { PhoneNumberQuestion } from '~/src/form/form-editor/preview/phone-number.js'
import { QuestionComponentElements } from '~/src/form/form-editor/preview/question.js'
import { RadioQuestion } from '~/src/form/form-editor/preview/radio.js'
import { SelectQuestion } from '~/src/form/form-editor/preview/select.js'
import { ShortAnswerQuestion } from '~/src/form/form-editor/preview/short-answer.js'
import { SupportingEvidenceQuestion } from '~/src/form/form-editor/preview/supporting-evidence.js'
import {
  UkAddressComponentPreviewElements,
  UkAddressQuestion
} from '~/src/form/form-editor/preview/uk-address.js'
import { YesNoQuestion } from '~/src/form/form-editor/preview/yes-no.js'
import { findDefinitionListFromComponent } from '~/src/form/utils/list.js'
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
  [ComponentType.FileUploadField]: SupportingEvidenceQuestion,
  [ComponentType.EastingNorthingField]: ShortAnswerQuestion,
  [ComponentType.OsGridRefField]: ShortAnswerQuestion,
  [ComponentType.NationalGridFieldNumberField]: ShortAnswerQuestion,
  [ComponentType.LatLongField]: ShortAnswerQuestion
}

/**
 * @param {QuestionRenderer} questionRenderer
 * @param {FormDefinition} definition
 * @returns {(component: ComponentDef) => Question}
 */
export function mapComponentToPreviewQuestion(questionRenderer, definition) {
  return /** @type {(component: ComponentDef) => Question} */ (
    (component) => {
      /**
       * @type {QuestionElements}
       */
      let questionElements

      if (
        component.type === ComponentType.AutocompleteField ||
        component.type === ComponentType.SelectField
      ) {
        const list = findDefinitionListFromComponent(component, definition)
        questionElements = new SelectComponentElements(component, list)
      } else if (component.type === ComponentType.UkAddressField) {
        questionElements = new UkAddressComponentPreviewElements(component)
      } else if (component.type === ComponentType.NumberField) {
        questionElements = new NumberComponentPreviewElements(component)
      } else if (hasSelectionFields(component) && hasListField(component)) {
        const list = findDefinitionListFromComponent(component, definition)
        questionElements = new ListComponentElements(component, list)
      } else if (
        hasInputField(component) ||
        component.type === ComponentType.YesNoField
      ) {
        questionElements = new QuestionComponentElements(component)
      } else if (hasContentField(component)) {
        questionElements = new ContentElements(component)
      } else {
        questionElements = new ComponentElements(component)
      }

      const QuestionConstructor = InputFieldComponentDictionary[component.type]

      const previewComponent = new QuestionConstructor(
        questionElements,
        questionRenderer
      )
      previewComponent.id = component.id
      return previewComponent
    }
  )
}

/**
 * @import { QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 */
