import { createGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'

import config from './uno.config'

describe('no-scrollbar shortcut', () => {
  it('resolves to a real scrollbar-width declaration', async () => {
    const generator = await createGenerator(config)
    const { css } = await generator.generate('no-scrollbar')

    expect(css).toContain('scrollbar-width:none')
    expect(css).toContain('-webkit-scrollbar')
  })
})
