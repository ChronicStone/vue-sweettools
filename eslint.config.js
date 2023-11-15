import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'ts/consistent-type-definitions': 'off',
    'vue/no-extra-parens': 'off',
    'no-console': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
})
