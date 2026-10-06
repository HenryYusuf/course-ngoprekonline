import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Youtube from './Youtube.vue'

describe('youtube embed', () => {
  it('renders a privacy-enhanced lazy iframe', async () => {
    const wrapper = await mountSuspended(Youtube, { props: { id: 'abc123' } })
    const iframe = wrapper.find('iframe')

    expect(iframe.attributes('src')).toBe('https://www.youtube-nocookie.com/embed/abc123')
    expect(iframe.attributes('loading')).toBe('lazy')
  })
})
