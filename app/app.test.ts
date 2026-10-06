import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import App from './app.vue'

describe('app', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(App, {
      global: {
        stubs: {
          NuxtPage: true,
          NuxtRouteAnnouncer: true,
        },
      },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
