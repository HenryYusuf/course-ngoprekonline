import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  pnpm: true,
  antislop: true,
  unocss: true,
  // Generated assets: self-hosted webfont faces (issue #12). Not lintable code.
  ignores: ['public/fonts/**', 'app/assets/css/fonts.css'],
})
