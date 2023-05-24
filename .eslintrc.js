module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['**/lib/', '**/dist/'],
  rules: {
  }
}
