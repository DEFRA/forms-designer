import {
  ComponentType,
  ControllerPath,
  ControllerType
} from '@defra/forms-model'

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithSinglePage = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'c1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'c2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithSummaryOnly = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithoutSummary = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoPagesAndQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question - page two',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question - page two',
          hint: 'Help text',
          options: {
            required: false
          },
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p3',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoQuestions = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoPages = {
  name: 'Test form',
  pages: [],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithExistingGuidance = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      id: '12345',
      components: [
        {
          id: '45678',
          type: ComponentType.Markdown,
          name: 'html-guidance',
          title: 'html-title',
          content: 'Original guidance',
          options: {}
        },
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithExistingSummaryDeclaration = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      id: 'p1',
      components: [
        {
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: [
        {
          id: '45678',
          type: ComponentType.Markdown,
          name: 'html-declaration',
          title: 'html-title',
          content: 'Declaration text',
          options: {}
        }
      ]
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithMissingPageIds = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question - page two',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question - page two',
          hint: 'Help text',
          options: {
            required: false
          },
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithAGuidancePage = {
  name: 'Test form',
  pages: [
    {
      path: '/page-one',
      title: 'Page one',
      section: 'section',
      id: 'p1',
      components: [
        {
          id: 'c1',
          type: ComponentType.Markdown,
          name: 'html-guidance',
          title: 'html-title',
          content: 'Original guidance',
          options: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithFileUploadPage = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/file-upload',
      title: 'Upload a file',
      controller: ControllerType.FileUpload,
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.FileUploadField,
          name: 'fileUpload',
          title: 'Upload a file',
          options: {},
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your first question - page two',
          hint: 'Help text',
          options: {},
          schema: {}
        },
        {
          id: 'q2',
          type: ComponentType.TextField,
          name: 'textField',
          title: 'This is your second question - page two',
          hint: 'Help text',
          options: {
            required: false
          },
          schema: {}
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      id: 'p3',
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: []
    }
  ],
  conditions: [],
  sections: [],
  lists: []
}

/**
 * @param {Partial<PageQuestion>} [partialPage]
 * @returns {PageQuestion}
 */
export function buildQuestionPage(partialPage = {}) {
  return {
    id: 'ffefd409-f3f4-49fe-882e-6e89f44631b1',
    title: 'Page One',
    path: '/page-one',
    next: [],
    components: [],
    ...partialPage
  }
}

/**
 * @param {Partial<PageSummary>} [partialSummaryPage]
 */
export function buildSummaryPage(partialSummaryPage = {}) {
  /** @type {PageSummary} */
  const page = /** @satisfies {PageSummary} */ {
    id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
    title: 'Summary',
    path: ControllerPath.Summary,
    controller: ControllerType.Summary,
    ...partialSummaryPage
  }
  return page
}

/**
 * @param {Partial<TextFieldComponent>} partialTextField
 * @returns {TextFieldComponent}
 */
export function buildTextFieldComponent(partialTextField = {}) {
  return /** @satisfies {TextFieldComponent} */ {
    id: '407dd0d7-cce9-4f43-8e1f-7d89cb698875',
    name: 'TextField',
    title: 'Text field',
    type: ComponentType.TextField,
    hint: '',
    options: {},
    schema: {},
    ...partialTextField
  }
}

/**
 * @param {Partial<FileUploadFieldComponent>} partialFileUploadField
 * @returns {FileUploadFieldComponent}
 */
export function buildFileUploadComponent(partialFileUploadField) {
  return {
    name: 'FileUploadField',
    type: ComponentType.FileUploadField,
    title: 'File Upload Field',
    options: {},
    schema: {},
    ...partialFileUploadField
  }
}

/**
 * Builder to create a Form Definition
 * @param {Partial<FormDefinition>} definitionPartial
 * @returns {FormDefinition}
 */
export function buildDefinition(definitionPartial = {}) {
  return {
    name: 'Test form',
    pages: [],
    conditions: [],
    sections: [],
    lists: [],
    ...definitionPartial
  }
}

/**
 * @param {Partial<List>} partialList
 * @returns {List}
 */
export function buildList(partialList = {}) {
  return {
    title: 'Development language2',
    name: 'YhmNDD',
    type: 'string',
    items: [
      {
        text: 'Javascript',
        value: 'javascript'
      },
      {
        text: 'TypeScript',
        value: 'typescript'
      },
      {
        text: 'Python',
        value: 'python'
      },
      {
        text: 'Haskell',
        value: 'haskell'
      },
      {
        text: 'Erlang',
        value: 'erlang'
      },
      {
        text: 'Java',
        value: 'java'
      }
    ],
    ...partialList
  }
}
/**
 * @import { FormDefinition, PageQuestion, PageSummary, TextFieldComponent, FileUploadFieldComponent, List } from '@defra/forms-model'
 */
