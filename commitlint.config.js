export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // `content` is emitted by Nuxt Studio when editors publish changes
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'content', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']],
  },
}
