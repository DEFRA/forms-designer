import {
  ComponentType,
  ConditionType,
  ControllerPath,
  ControllerType,
  Coordinator,
  Engine,
  OperatorName
} from '@defra/forms-model'

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
 *
 * @param {Partial<AutocompleteFieldComponent>} partialAutoCompleteField
 * @returns {AutocompleteFieldComponent}
 */
export function buildAutoCompleteComponent(partialAutoCompleteField) {
  return {
    name: 'AutoCompleteField',
    title: 'What languages do you speak?',
    type: ComponentType.AutocompleteField,
    list: 'AutoCompleteList',
    options: {},
    ...partialAutoCompleteField
  }
}

/**
 * @param {Partial<RadiosFieldComponent>} partialListComponent
 * @returns {RadiosFieldComponent}
 */
export function buildRadioComponent(partialListComponent) {
  return {
    name: 'RadioField',
    title: 'Which country do you live in?',
    type: ComponentType.RadiosField,
    list: 'RadioList',
    options: {},
    ...partialListComponent
  }
}

/**
 * @param {Partial<CheckboxesFieldComponent>} partialListComponent
 * @returns {CheckboxesFieldComponent}
 */
export function buildCheckboxComponent(partialListComponent) {
  return {
    name: 'FellowshipOfTheRing',
    title: 'Which are your favourite characters from the fellowship?',
    type: ComponentType.CheckboxesField,
    list: 'CheckboxList',
    options: {},
    ...partialListComponent
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
 *
 * @param {Partial<Item>} partialListItem
 * @returns {Item}
 */
export function buildListItem(partialListItem = {}) {
  return {
    text: 'Javascript',
    value: 'javascript',
    ...partialListItem
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
      buildListItem({
        text: 'Javascript',
        value: 'javascript'
      }),
      buildListItem({
        text: 'TypeScript',
        value: 'typescript'
      }),
      buildListItem({
        text: 'Python',
        value: 'python'
      }),
      buildListItem({
        text: 'Haskell',
        value: 'haskell'
      }),
      buildListItem({
        text: 'Erlang',
        value: 'erlang'
      }),
      buildListItem({
        text: 'Java',
        value: 'java'
      })
    ],
    ...partialList
  }
}

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
          id: '99011',
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
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithRadioQuestionAndList = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/radio-question',
      title: 'Radio question',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.RadiosField,
          name: 'radio-field',
          title: 'Select a colour',
          options: {},
          list: 'my-list-guid'
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
  lists: [
    {
      id: 'my-list-guid',
      name: 'my-list',
      title: 'my list title',
      type: 'string',
      items: [
        { text: 'Blue', value: 'blue' },
        { text: 'Red', value: 'red' },
        { text: 'Green', value: 'green' }
      ]
    }
  ]
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithRadioQuestionAndmislinkedList = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/radio-question',
      title: 'Radio question',
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.RadiosField,
          name: 'radio-field',
          title: 'Select a colour',
          options: {},
          list: 'my-list-guid'
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
  lists: [
    {
      id: 'my-list-guid-invalid',
      name: 'my-list',
      title: 'my list title',
      type: 'string',
      items: []
    }
  ]
}

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithOneQuestionNoPageTitle = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/page-one',
      title: '',
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
export const testFormDefinitionWithRepeater = {
  name: 'Test form',
  pages: [
    {
      id: 'p1',
      path: '/pizza',
      title: 'Pizza',
      controller: ControllerType.Repeat,
      repeat: {
        schema: { min: 1, max: 5 },
        options: { title: 'Pizza', name: 'xdGhbu' }
      },
      section: 'section',
      components: [
        {
          id: 'q1',
          type: ComponentType.TextField,
          name: 'toppings',
          title: 'Toppings',
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
export const testFormDefinitionWithMultipleV2Conditions = {
  name: 'Form name',
  startPage: '/summary',
  pages: [
    {
      title: 'What is your full name',
      path: '/what-is-your-full-name',
      components: [
        {
          type: ComponentType.TextField,
          title: 'What is your full name',
          name: 'RRwYht',
          shortDescription: 'What is your full name',
          hint: '',
          options: {
            required: true
          },
          schema: {},
          id: '154271c2-79a2-4b59-b535-d210a13dbfe9'
        }
      ],
      next: [],
      id: '449c053b-9201-4312-9a75-187ac1b720eb'
    },
    {
      title: 'Fave color',
      path: '/fave-color',
      components: [
        {
          type: ComponentType.RadiosField,
          title: 'What is your favourite color',
          name: 'nUaCCW',
          shortDescription: 'Fave color',
          hint: '',
          options: {
            required: true
          },
          list: 'ukcXCd',
          id: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2'
        }
      ],
      next: [],
      id: '2c3122b6-bf57-42c9-ab1b-6f67e8575703'
    },
    {
      title: 'Fave animal',
      path: '/fave-animal',
      components: [
        {
          type: ComponentType.CheckboxesField,
          title: 'What is your favourite animal',
          name: 'nUaCCW',
          shortDescription: 'Fave animal',
          hint: '',
          options: {
            required: true
          },
          list: 'sdewRT',
          id: 'f0f67bf7-cdbb-4247-9f3c-8cd919183968'
        }
      ],
      next: [],
      id: 'a86ea4ba-ae3b-4324-9acd-3a3f347cb0ec'
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: ControllerType.Summary,
      components: [],
      id: '0ee40b39-fcae-4012-8725-7e3f5f75f88c'
    }
  ],
  conditions: [
    {
      name: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2',
      displayName: 'isBobV2',
      conditions: [
        {
          id: 'bd071563-1261-4e5c-ab30-05dde59b86f6',
          componentId: '154271c2-79a2-4b59-b535-d210a13dbfe9',
          operator: OperatorName.Is,
          value: {
            type: ConditionType.StringValue,
            value: 'bob'
          }
        }
      ]
    },
    {
      displayName: 'isBob',
      name: 'LoaWPy',
      value: {
        name: 'isBob',
        conditions: [
          {
            field: {
              name: 'RRwYht',
              type: ComponentType.TextField,
              display: 'What is your full name'
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'Bob',
              display: 'Bob'
            }
          }
        ]
      }
    },
    {
      name: '4a82930a-b8f5-498c-adae-6158bb2aeeb5',
      displayName: 'isFaveColourRedV2',
      conditions: [
        {
          id: '7ccd81c7-6c44-4de2-9c2b-fc917b7e9f35',
          componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
          operator: OperatorName.Is,
          value: {
            type: ConditionType.StringValue,
            value: 'red'
          }
        }
      ]
    },
    {
      displayName: 'isFaveColourRed',
      name: 'SxzrgR',
      value: {
        name: 'isFaveColourRed',
        conditions: [
          {
            field: {
              name: 'nUaCCW',
              type: ComponentType.RadiosField,
              display: 'What is your favourite color'
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: 'red',
              display: 'Red'
            }
          }
        ]
      }
    },
    {
      displayName: 'isBobAndFaveColourRed',
      name: 'drFGth',
      value: {
        name: 'isBobAndFaveColourRed',
        conditions: [
          {
            conditionName: 'isBob',
            conditionDisplayName: 'isBob'
          },
          {
            conditionName: 'isFaveColourRed',
            conditionDisplayName: 'isFaveColourRed',
            coordinator: Coordinator.AND
          }
        ]
      }
    },
    {
      displayName: 'isBobAndFaveColourRedV2',
      name: '7ae768b6-1bc5-4a9b-911a-d813e5614e8e',
      coordinator: Coordinator.AND,
      conditions: [
        {
          id: 'f54fcebc-f103-451f-8356-1a08f1f32f56',
          conditionId: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
        },
        {
          id: 'f77a9375-c03f-4365-94b5-edbdbe9e29bd',
          conditionId: '4a82930a-b8f5-498c-adae-6158bb2aeeb5'
        }
      ]
    },
    {
      displayName: 'isFaveAnimalMonkey',
      name: 'b4bcd680-b9b5-4d1e-a42f-5b5f8c91f551',
      value: {
        name: 'isFaveAnimalMonkey',
        conditions: [
          {
            field: {
              name: 'nUaCCW',
              type: ComponentType.RadiosField,
              display: 'What is your favourite animal'
            },
            operator: OperatorName.Contains,
            value: {
              type: ConditionType.Value,
              value: 'monkey',
              display: 'Monkey'
            }
          }
        ]
      }
    }
  ],
  sections: [
    {
      name: 'section',
      title: 'Section title',
      hideTitle: false
    }
  ],
  lists: [
    {
      name: 'ukcXCd',
      title: 'List for question nUaCCW',
      type: 'string',
      items: [
        {
          id: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7',
          text: 'Red',
          value: 'red'
        },
        {
          id: '689d3f66-88f7-4dc0-b199-841b72393c19',
          text: 'Blue',
          value: 'blue'
        },
        {
          id: '93d8b63b-4eef-4c3e-84a7-5b7edb7f9171',
          text: 'Green',
          value: 'green'
        }
      ],
      id: '3e470333-c2aa-4bd4-bd1a-738819226a3a'
    },
    {
      name: 'sdewRT',
      title: 'Animals',
      type: 'string',
      items: [
        {
          id: 'fb3519b2-c6c7-40b6-8e03-2fb0db6d4f32',
          text: 'Horse',
          value: 'horse'
        },
        {
          id: '0c546ae1-897e-48d0-9388-b0902fe23baf',
          text: 'Monkey',
          value: 'monkey'
        },
        {
          id: '39f6fa65-1781-4569-9ba3-d8d13931f036',
          text: 'Giraffe',
          value: 'giraffe'
        }
      ],
      id: '0e047f83-dbb6-4c82-b709-f9dbaddf8644'
    }
  ],
  engine: Engine.V2
}

/**
 * @import { FormMetadata, FormDefinition, PageQuestion, PageSummary, PageFileUpload, PageRepeat, TextFieldComponent, FileUploadFieldComponent, AutocompleteFieldComponent, List, Item, RadiosFieldComponent, CheckboxesFieldComponent } from '@defra/forms-model'
 */
