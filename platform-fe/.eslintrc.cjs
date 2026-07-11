module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'plugin:react-hooks/recommended', 'eslint-config-prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'eslint-plugin-prettier'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      2,
      {
        "args": "none"
      }
    ],
    'prettier/prettier': ['warn'],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'prefer-arrow-callback': 'error',
    'react/react-in-jsx-scope': 0,
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-empty-function': 'error',
    'no-empty': 'error',
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unsafe-return': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
  },
};
