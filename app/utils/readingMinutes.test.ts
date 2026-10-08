import { describe, expect, it } from 'vitest'

import { readingMinutes } from './readingMinutes'

function textBody(words: number) {
  return {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: Array.from({ length: words }, (_, i) => `kata${i}`).join(' ') }],
      },
    ],
  }
}

describe('readingMinutes', () => {
  it('counts words across the mdast tree at 200 wpm', () => {
    expect(readingMinutes(textBody(200))).toBe(1)
    expect(readingMinutes(textBody(600))).toBe(3)
  })

  it('collects nested nodes, not just the top level', () => {
    const body = {
      type: 'root',
      children: [
        { type: 'heading', children: [{ type: 'text', value: 'Judul bagian' }] },
        { type: 'code', value: 'print("halo")' },
        { type: 'paragraph', children: [{ type: 'text', value: 'Isi paragraf' }] },
      ],
    }
    expect(readingMinutes(body)).toBe(1)
  })

  it('floors at 1 minute and survives missing bodies', () => {
    expect(readingMinutes(undefined)).toBe(1)
    expect(readingMinutes({ type: 'root', children: [] })).toBe(1)
    expect(readingMinutes(null)).toBe(1)
  })
})
