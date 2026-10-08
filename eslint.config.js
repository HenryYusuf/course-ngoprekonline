import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  pnpm: true,
  antislop: true,
  unocss: true,
  // Generated assets: self-hosted webfont faces (issue #12). Not lintable code.
  // Impeccable workflow artifacts: pinned direction contracts and skill
  // payloads must stay byte-for-byte as issued, so prose rules skip them.
  ignores: ['public/fonts/**', 'app/assets/css/fonts.css', '.impeccable/**'],
})
