import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import HeroSection from './HeroSection.vue'

describe('heroSection', () => {
  it('renders the three-word hero with a blinking caret and tagline', async () => {
    const wrapper = await mountSuspended(HeroSection)
    const html = wrapper.html()

    expect(html).toContain('Belajar.')
    expect(html).toContain('Ngoprek.')
    expect(html).toContain('Terbitkan.')
    expect(html).toContain('caret-blink')
  })
})
