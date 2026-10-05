import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from './app.vue'

describe('app', () => {
  it('renders', () => {
    const wrapper = mount(App)

    expect(wrapper.html()).toBeTruthy()
  })
})
