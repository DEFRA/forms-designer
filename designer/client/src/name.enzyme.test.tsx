import React from 'react'
import { mount } from 'enzyme'
import { Name } from './name'

describe('Name component', () => {
  const i18n = jest.fn(() => 'mockTranslation')

  describe('update method', () => {
    test('update method is called with correct param', () => {
      const component = {
        type: 'TextField',
        name: 'myComponent',
        title: 'My component'
      }
      const updateModelSpy = jest.fn()
      const wrapper = mount(
        <Name
          name="myComponent"
          id={'an-id'}
          labelText={'label text'}
          updateModel={updateModelSpy}
          i18n={i18n}
        />
      )
      const field = wrapper.find('#an-id').hostNodes()
      field.simulate('change', { target: { value: 'beepboop' } })
      expect(updateModelSpy).toHaveBeenCalledTimes(1)
      expect(updateModelSpy.mock.calls[0][0]).toEqual('beepboop')
    })
    test('update method is not called when there is an error', () => {
      const component = {
        type: 'TextField',
        name: 'myComponent',
        title: 'My component'
      }
      const updateModelSpy = jest.fn()
      const wrapper = mount(
        <Name
          name="myComponent"
          id={'an-id'}
          labelText={'label text'}
          updateModel={updateModelSpy}
          i18n={i18n}
        />
      )
      const field = wrapper.find('#an-id').hostNodes()
      field.simulate('change', { target: { value: 'beep boop' } })
      expect(updateModelSpy).not.toHaveBeenCalled()
    })
  })
  describe('Without update method', () => {
    test('renders correctly with all props provided', () => {
      const wrapper = mount(
        <Name
          id={'an-id'}
          labelText={'label text'}
          name={'myComponent'}
          hint={'a hint'}
          i18n={i18n}
        />
      )
      const field = wrapper.find('#an-id').hostNodes()
      expect(field.exists()).toEqual(true)
      expect(field.props().value).toEqual('myComponent')
      expect(wrapper.find('.govuk-label').text()).toEqual('label text')
      expect(wrapper.find('.govuk-hint').text()).toEqual('a hint')
      expect(wrapper.state()).toEqual({
        name: 'myComponent',
        errors: {}
      })
    })
  })
  test('Error message shows up when whitespaces are entered', () => {
    const wrapper = mount(
      <Name
        name="myComponent"
        id={'an-id'}
        labelText={'label text'}
        i18n={i18n}
      />
    )
    const field = wrapper.find('#an-id').hostNodes()
    field.simulate('change', {
      target: {
        value: `this${randomWhitespaceCharacter()}value${randomWhitespaceCharacter()}has dif${whitespaceCharacters.join(
          ''
        )}ferent spaces${randomWhitespaceCharacter()} in it`
      }
    })
    wrapper.update()
    expect(wrapper.find('.govuk-input--error').exists()).toEqual(true)
    expect(wrapper.find('.govuk-form-group--error').exists()).toEqual(true)
    expect(wrapper.find('.govuk-error-message').exists()).toEqual(true)
  })
})

const whitespaceCharacters = [
  '\u0020',
  '\u00A0',
  '\u2000',
  '\u2001',
  '\u2002',
  '\u2003',
  '\u2004',
  '\u2005',
  '\u2006',
  '\u2007',
  '\u2008',
  '\u2009',
  '\u200A',
  '\u2028',
  '\u205F',
  '\u3000'
]

const randomWhitespaceCharacter = () => {
  return whitespaceCharacters[
    Math.floor(Math.random() * whitespaceCharacters.length)
  ]
}
