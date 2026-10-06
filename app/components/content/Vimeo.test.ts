import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import Vimeo from './Vimeo.vue'

describe('vimeo embed', () => {
  it('renders a lazy iframe pointing at the Vimeo player', async () => {
    const wrapper = await mountSuspended(Vimeo, { props: { id: '12345' } })
    const iframe = wrapper.find('iframe')

    expect(iframe.attributes('src')).toBe('https://player.vimeo.com/video/12345')
    expect(iframe.attributes('loading')).toBe('lazy')
  })
})
