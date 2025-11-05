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
import {
  DeclarationComponentPreviewElements,
  DeclarationQuestion
} from '~/src/form/form-editor/preview/declaration.js'
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
  [ComponentType.DeclarationField]: DeclarationQuestion,
  [ComponentType.FileUploadField]: SupportingEvidenceQuestion,
  [ComponentType.EastingNorthingField]: ShortAnswerQuestion,
  [ComponentType.OsGridRefField]: ShortAnswerQuestion,
  [ComponentType.NationalGridFieldNumberField]: ShortAnswerQuestion,
  [ComponentType.LatLongField]: ShortAnswerQuestion
}

/**
 * @type {Partial<Record<ComponentType, (component: ComponentDef, definition: FormDefinition ) => QuestionElements>>}
 */
const ComponentToPreviewQuestion = {
  [ComponentType.AutocompleteField]: (component, definition) => {
    const componentCoerced = /** @type {AutocompleteFieldComponent} */ (
      component
    )
    const list = findDefinitionListFromComponent(componentCoerced, definition)
    return new SelectComponentElements(componentCoerced, list)
  },
  [ComponentType.SelectField]: (component, definition) => {
    const componentCoerced = /** @type {SelectFieldComponent} */ (component)
    const list = findDefinitionListFromComponent(componentCoerced, definition)
    return new SelectComponentElements(componentCoerced, list)
  },
  [ComponentType.UkAddressField]: (component, _definition) => {
    const componentCoerced = /** @type {UkAddressFieldComponent} */ (component)
    return new UkAddressComponentPreviewElements(componentCoerced)
  },
  [ComponentType.NumberField]: (component, _definition) => {
    const componentCoerced = /** @type {NumberFieldComponent} */ (component)
    return new NumberComponentPreviewElements(componentCoerced)
  },
  [ComponentType.DeclarationField]: (component, _definition) => {
    const componentCoerced = /** @type {DeclarationFieldComponent} */ (
      component
    )
    return new DeclarationComponentPreviewElements(componentCoerced)
  },
  [ComponentType.YesNoField]: (component, _definition) => {
    const componentCoerced = /** @type {YesNoFieldComponent} */ (component)
    return new QuestionComponentElements(componentCoerced)
  }
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

      // Look for one-to-one mapping first, then fallback if not found
      const getQuestionElementsFunc = ComponentToPreviewQuestion[component.type]
      if (getQuestionElementsFunc) {
        questionElements = getQuestionElementsFunc(component, definition)
      } else if (hasSelectionFields(component) && hasListField(component)) {
        const list = findDefinitionListFromComponent(component, definition)
        questionElements = new ListComponentElements(component, list)
      } else if (hasInputField(component)) {
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
 * @import { AutocompleteFieldComponent, ComponentDef, DeclarationFieldComponent, NumberFieldComponent, SelectFieldComponent, UkAddressFieldComponent, YesNoFieldComponent } from '~/src/components/types.js'
 */
