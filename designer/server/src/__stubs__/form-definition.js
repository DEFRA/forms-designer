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
    title: 'Page one',
    path: '/page-one',
    next: [],
    components: [],
    ...partialPage
  }
}

/**
 * @param {Partial<PageFileUpload>} [partialPage]
 * @returns {PageFileUpload}
 */
export function buildFileUploadPage(partialPage = {}) {
  return {
    id: 'ffefd409-f3f4-49fe-882e-6e89f44631b1',
    title: 'Page one',
    path: '/page-one',
    next: [],
    components: [],
    controller: ControllerType.FileUpload,
    ...partialPage
  }
}

/**
 * @param {Partial<PageRepeat>} [partialPage]
 * @returns {PageRepeat}
 */
export function buildRepeaterPage(partialPage = {}) {
  return {
    id: 'eeefd409-f3f4-49fe-882e-6e89f44631b1',
    title: 'Page repeat',
    path: '/page-repeat',
    next: [],
    components: [],
    controller: ControllerType.Repeat,
    repeat: {
      schema: { min: 1, max: 5 },
      options: { title: 'Pizza', name: 'xdGhbu' }
    },
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
    components: [],
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
 *
 * @param {Partial<DeclarationFieldComponent>} partialDeclarationField
 * @returns {DeclarationFieldComponent}
 */
export function buildDeclarationComponent(partialDeclarationField) {
  return {
    name: 'DeclarationField',
    title: 'Do you agree?',
    type: ComponentType.DeclarationField,
    content: 'My declaration text',
    options: {},
    ...partialDeclarationField
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
 * @param {Partial<MarkdownComponent>} partialComponent
 * @returns {MarkdownComponent}
 */
export function buildMarkdownComponent(partialComponent) {
  return {
    id: '45678',
    type: ComponentType.Markdown,
    name: 'html-guidance',
    title: 'html-title',
    content: 'Original guidance',
    options: {},
    ...partialComponent
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
export const testFormDefinitionWithSinglePage = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'c1',
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'c2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithSummaryOnly = buildDefinition({
  pages: [
    buildSummaryPage({
      id: 'p1'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithoutSummary = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'c1',
          name: 'textField',
          title: 'This is your first field',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoQuestions = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithTwoPagesAndQuestions = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is your first question',
          hint: 'Help text'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is your second question',
          hint: 'Help text'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildQuestionPage({
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'textField',
          title: 'This is your first question - page two',
          hint: 'Help text'
        }),
        buildTextFieldComponent({
          id: 'q2',
          name: 'textField',
          title: 'This is your second question - page two',
          hint: 'Help text',
          options: {
            required: false
          }
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p3'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoQuestions = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithNoPages = buildDefinition({})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithExistingGuidance = buildDefinition({
  pages: [
    buildQuestionPage({
      id: '12345',
      section: 'section',
      components: [buildMarkdownComponent({})],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'c2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithComponentsAndLeadingGuidance =
  buildDefinition({
    pages: [
      buildQuestionPage({
        id: '12345',
        section: 'section',
        components: [
          buildMarkdownComponent({
            id: '04132d25-a648-43ae-9d5d-6fa410ae8d99'
          }),
          buildTextFieldComponent({
            id: 'cda48ac2-91b1-47a8-ba14-8480b5d2c86f'
          }),
          buildTextFieldComponent({
            id: '43425d8e-4832-4ed1-a574-1d29fd63cf3c',
            title: 'This is your second question - page two',
            options: {
              required: false
            }
          })
        ],
        next: [{ path: '/summary' }]
      }),
      buildSummaryPage({
        id: 'p2'
      })
    ]
  })

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithExistingSummaryDeclaration = buildDefinition(
  {
    pages: [
      buildQuestionPage({
        id: 'p1',
        section: 'section',
        components: [
          buildTextFieldComponent({
            title: 'This is your first field'
          })
        ],
        next: [{ path: '/summary' }]
      }),
      buildSummaryPage({
        id: 'p2',
        components: [
          buildMarkdownComponent({
            id: '45678',
            content: 'Declaration text'
          })
        ]
      })
    ]
  }
)

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithMissingPageIds = buildDefinition({
  pages: [
    buildQuestionPage({
      id: undefined,
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          title: 'This is your first question'
        }),
        buildTextFieldComponent({
          id: 'q2',
          title: 'This is your second question'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildQuestionPage({
      id: undefined,
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          title: 'This is your first question - page two'
        }),
        buildTextFieldComponent({
          id: 'q2',
          title: 'This is your second question - page two',
          options: {
            required: false
          }
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: undefined
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithAGuidancePage = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      section: 'section',
      components: [
        buildMarkdownComponent({
          id: 'c1'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'c2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithFileUploadPage = buildDefinition({
  pages: [
    buildFileUploadPage({
      id: 'p1',
      path: '/file-upload',
      title: 'Upload a file',
      controller: ControllerType.FileUpload,
      section: 'section',
      components: [
        buildFileUploadComponent({
          id: 'q1',
          name: 'fileUpload',
          title: 'Upload a file'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildQuestionPage({
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          title: 'This is your first question - page two'
        }),
        buildTextFieldComponent({
          id: 'q2',
          title: 'This is your second question - page two',
          options: {
            required: false
          }
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p3'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithRadioQuestionAndList = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      path: '/radio-question',
      title: 'Radio question',
      section: 'section',
      components: [
        buildRadioComponent({
          id: 'q1',
          name: 'radio-field',
          title: 'Select a colour',
          list: 'my-list-guid'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p2'
    })
  ],
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
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithRadioQuestionAndMislinkedList =
  buildDefinition({
    pages: [
      buildQuestionPage({
        id: 'p1',
        path: '/radio-question',
        title: 'Radio question',
        section: 'section',
        components: [
          buildRadioComponent({
            id: 'q1',
            name: 'radio-field',
            title: 'Select a colour',
            list: 'my-list-guid'
          })
        ],
        next: [{ path: '/summary' }]
      }),
      buildSummaryPage({
        id: 'p2'
      })
    ],
    lists: [
      {
        id: 'my-list-guid-invalid',
        name: 'my-list',
        title: 'my list title',
        type: 'string',
        items: []
      }
    ]
  })

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithOneQuestionNoPageTitle = buildDefinition({
  pages: [
    buildQuestionPage({
      id: 'p1',
      title: '',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          title: 'This is your first question'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'c2'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithRepeater = buildDefinition({
  pages: [
    buildRepeaterPage({
      path: '/pizza',
      title: 'Pizza',
      repeat: {
        schema: { min: 1, max: 5 },
        options: { title: 'Pizza', name: 'xdGhbu' }
      },
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          name: 'toppings',
          title: 'Toppings'
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildQuestionPage({
      id: 'p2',
      path: '/page-two',
      title: 'Page two',
      section: 'section',
      components: [
        buildTextFieldComponent({
          id: 'q1',
          title: 'This is your first question - page two'
        }),
        buildTextFieldComponent({
          id: 'q2',
          title: 'This is your second question - page two',
          options: {
            required: false
          }
        })
      ],
      next: [{ path: '/summary' }]
    }),
    buildSummaryPage({
      id: 'p3'
    })
  ]
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithMultipleV2Conditions = buildDefinition({
  name: 'Form name',
  startPage: '/summary',
  pages: [
    buildQuestionPage({
      id: '449c053b-9201-4312-9a75-187ac1b720eb',
      title: 'What is your full name',
      path: '/what-is-your-full-name',
      components: [
        buildTextFieldComponent({
          id: '154271c2-79a2-4b59-b535-d210a13dbfe9',
          title: 'What is your full name',
          name: 'RRwYht',
          shortDescription: 'What is your full name',
          options: {
            required: true
          }
        })
      ],
      next: []
    }),
    buildQuestionPage({
      id: '2c3122b6-bf57-42c9-ab1b-6f67e8575703',
      title: 'Fave color',
      path: '/fave-color',
      components: [
        buildRadioComponent({
          id: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
          title: 'What is your favourite color',
          name: 'nUaCCW',
          shortDescription: 'Fave color',
          options: {
            required: true
          },
          list: '3e470333-c2aa-4bd4-bd1a-738819226a3a'
        })
      ],
      next: []
    }),
    buildQuestionPage({
      id: '86ea4baf-ae3b-4324-9acd-3a3f347cb0ec',
      title: 'Fave animal',
      path: '/fave-animal',
      components: [
        buildRadioComponent({
          id: 'f0f67bf7-cdbb-4247-9f3c-8cd919183968',
          title: 'What is your favourite animal',
          name: 'nUaCCW',
          shortDescription: 'Fave animal',
          options: {
            required: true
          },
          list: '0e047f83-dbb6-4c82-b709-f9dbaddf8644'
        })
      ],
      next: []
    }),
    buildSummaryPage({
      id: '0ee40b39-fcae-4012-8725-7e3f5f75f88c'
    })
  ],
  conditions: [
    {
      id: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2',
      displayName: 'isBobV2',
      items: [
        {
          id: 'bd071563-1261-4e5c-ab30-05dde59b86f6',
          componentId: '154271c2-79a2-4b59-b535-d210a13dbfe9',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'bob'
        }
      ]
    },
    {
      id: '4a82930a-b8f5-498c-adae-6158bb2aeeb5',
      displayName: 'isFaveColourRedV2',
      items: [
        {
          id: '7ccd81c7-6c44-4de2-9c2b-fc917b7e9f35',
          componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
          operator: OperatorName.Is,
          type: ConditionType.StringValue,
          value: 'red'
        }
      ]
    },
    {
      id: 'c685ae47-a134-485a-a819-b6271644722e',
      displayName: 'isBobAndFaveColourRedV2',
      coordinator: Coordinator.AND,
      items: [
        {
          id: 'f54fcebc-f103-451f-8356-1a08f1f32f56',
          conditionId: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
        },
        {
          id: 'f77a9375-c03f-4365-94b5-edbdbe9e29bd',
          conditionId: '4a82930a-b8f5-498c-adae-6158bb2aeeb5'
        }
      ]
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
})

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithMultipleV2ConditionsListRef =
  buildDefinition({
    ...testFormDefinitionWithMultipleV2Conditions,
    conditions: [
      {
        id: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2',
        displayName: 'isBobV2',
        items: [
          {
            id: 'bd071563-1261-4e5c-ab30-05dde59b86f6',
            componentId: '154271c2-79a2-4b59-b535-d210a13dbfe9',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'bob'
          }
        ]
      },
      {
        id: '4a82930a-b8f5-498c-adae-6158bb2aeeb5',
        displayName: 'isFaveColourRedV2',
        items: [
          {
            id: '7ccd81c7-6c44-4de2-9c2b-fc917b7e9f35',
            componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
            operator: OperatorName.Is,
            type: ConditionType.ListItemRef,
            value: {
              listId: '3e470333-c2aa-4bd4-bd1a-738819226a3a',
              itemId: 'e1d4f56e-ad92-49ea-89a8-cf0edb0480f7'
            }
          }
        ]
      },
      {
        id: 'c685ae47-a134-485a-a819-b6271644722e',
        displayName: 'isBobAndFaveColourRedV2',
        coordinator: Coordinator.AND,
        items: [
          {
            id: 'f54fcebc-f103-451f-8356-1a08f1f32f56',
            conditionId: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
          },
          {
            id: 'f77a9375-c03f-4365-94b5-edbdbe9e29bd',
            conditionId: '4a82930a-b8f5-498c-adae-6158bb2aeeb5'
          }
        ]
      }
    ]
  })

/**
 * @satisfies {FormDefinition}
 */
export const testFormDefinitionWithMultipleV2ConditionsWithUnassigned =
  buildDefinition({
    ...testFormDefinitionWithMultipleV2Conditions,
    conditions: [
      ...testFormDefinitionWithMultipleV2Conditions.conditions,
      {
        id: 'aae9f931-e151-4dd6-a2b9-68a03f3537e2',
        displayName: 'isUnassignedCond',
        items: [
          {
            id: 'aa071563-1261-4e5c-ab30-05dde59b86f6',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'unassigned',
            componentId: '154271c2-79a2-4b59-b535-d210a13dbfe9'
          }
        ]
      }
    ]
  })

/**
 * @import { DeclarationFieldComponent, FormDefinition, PageFileUpload, PageQuestion, PageRepeat, PageSummary, TextFieldComponent, FileUploadFieldComponent, AutocompleteFieldComponent, List, Item, RadiosFieldComponent, CheckboxesFieldComponent, MarkdownComponent } from '@defra/forms-model'
 */
