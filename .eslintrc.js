module.exports = {
  extends: 'airbnb-base',
  env: {
    'es6': true,
  },
  rules: {
    'object-curly-spacing': ['error', 'never'],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'no-unused-expressions': [
      'error',
      {'allowShortCircuit': true},
    ],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    strict: 'off',
  },
};