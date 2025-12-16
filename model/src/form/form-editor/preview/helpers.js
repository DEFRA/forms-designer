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
import {
  EastingNorthingComponentPreviewElements,
  EastingNorthingQuestion
} from '~/src/form/form-editor/preview/easting-northing.js'
import { EmailAddressQuestion } from '~/src/form/form-editor/preview/email-address.js'
import { HiddenQuestion } from '~/src/form/form-editor/preview/hidden.js'
import {
  LatLongComponentPreviewElements,
  LatLongQuestion
} from '~/src/form/form-editor/preview/lat-long.js'
import {
  ListComponentElements,
  ListQuestion,
  SelectComponentElements
} from '~/src/form/form-editor/preview/list.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { MonthYearQuestion } from '~/src/form/form-editor/preview/month-year.js'
import {
  NationalGridComponentPreviewElements,
  NationalGridQuestion
} from '~/src/form/form-editor/preview/national-grid.js'
import {
  NumberComponentPreviewElements,
  NumberOnlyQuestion
} from '~/src/form/form-editor/preview/number-only.js'
import {
  OsGridRefComponentPreviewElements,
  OsGridRefQuestion
} from '~/src/form/form-editor/preview/os-grid-ref.js'
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
import { UnsupportedQuestion } from '~/src/form/form-editor/preview/unsupported-question.js'
import { YesNoQuestion } from '~/src/form/form-editor/preview/yes-no.js'
import { findDefinitionListFromComponent } from '~/src/form/utils/list.js'
/**
 * @type {typeof PreviewComponent}
 */
const InvalidFieldComponent = UnsupportedQuestion

/**
 * @type {Partial<Record<ComponentType, typeof PreviewComponent>>}
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
  [ComponentType.EastingNorthingField]: EastingNorthingQuestion,
  [ComponentType.OsGridRefField]: OsGridRefQuestion,
  [ComponentType.NationalGridFieldNumberField]: NationalGridQuestion,
  [ComponentType.LatLongField]: LatLongQuestion,
  [ComponentType.HiddenField]: HiddenQuestion
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
  },
  [ComponentType.EastingNorthingField]: (component, _definition) => {
    const componentCoerced = /** @type {EastingNorthingFieldComponent} */ (
      component
    )
    return new EastingNorthingComponentPreviewElements(componentCoerced)
  },
  [ComponentType.OsGridRefField]: (component, _definition) => {
    const componentCoerced = /** @type {OsGridRefFieldComponent} */ (component)
    return new OsGridRefComponentPreviewElements(componentCoerced)
  },
  [ComponentType.NationalGridFieldNumberField]: (component, _definition) => {
    const componentCoerced =
      /** @type {NationalGridFieldNumberFieldComponent} */ (component)
    return new NationalGridComponentPreviewElements(componentCoerced)
  },
  [ComponentType.LatLongField]: (component, _definition) => {
    const componentCoerced = /** @type {LatLongFieldComponent} */ (component)
    return new LatLongComponentPreviewElements(componentCoerced)
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

      const QuestionConstructor =
        InputFieldComponentDictionary[component.type] ?? InvalidFieldComponent
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
 * @import { AutocompleteFieldComponent, ComponentDef, DeclarationFieldComponent, EastingNorthingFieldComponent, LatLongFieldComponent, NationalGridFieldNumberFieldComponent, NumberFieldComponent, OsGridRefFieldComponent, SelectFieldComponent, UkAddressFieldComponent, YesNoFieldComponent } from '~/src/components/types.js'
 */
