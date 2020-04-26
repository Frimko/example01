module.exports = {
  'root': true,
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint',
    'jest',
  ],
  'parserOptions': {
    'project': `./tsconfig.json`
  },
  'extends': [
    'react-app',
    'airbnb-typescript',
    'plugin:jest/recommended'
  ],
  'env': {
    'node': true,
    'browser': true,
    'jest': true
  },
  'overrides': [
    {
      'files': ['**/*.js?(x)'],
      'parser': 'babel-eslint',
      'plugins': [],
      'parserOptions': {
        'ecmaVersion': 6,
        'ecmaFeatures': {
          'jsx': true
        }
      },
    }
  ],
  'rules': {
    'object-curly-newline': [
      'error',
      { 'multiline': true, 'minProperties': 3 }
    ],
    "max-len": ["error", 120],
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'arrow-parens': 'off',
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-useless-catch': 'off',
  },
}
