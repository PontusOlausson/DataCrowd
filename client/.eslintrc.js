module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: [2, 'single', 'avoid-escape'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        'max-len': 'off' // disables line length check
      }
    }
  ],
};
