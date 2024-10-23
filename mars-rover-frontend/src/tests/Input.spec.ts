import { mount } from '@vue/test-utils'
import Input from '../components/Common/Input.vue'

describe('Input.vue', () => {
  it('renders the input with correct label and placeholder', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Username',
        modelValue: '',
        placeholder: 'Enter your username'
      }
    })

    expect(wrapper.find('label').text()).toBe('Username')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your username')
  })

  it('emits an update event when input value changes', async () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Username',
        modelValue: ''
      }
    })

    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value'])
  })

  it('shows error message when visibleError is true', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Username',
        modelValue: '',
        errors: [{ $message: 'This field is required' }]
      }
    })

    expect(wrapper.find('span').text()).toBe('This field is required')
    expect(wrapper.find('input').classes()).toContain('border-red-500')
  })
})
