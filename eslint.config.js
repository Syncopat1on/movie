import eslint from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    ...reactRecommended,
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...reactRecommended.rules,
      'no-unused-vars': 'warn',
      'no-empty': 'warn',
      'no-console': 'warn',
      'no-cond-assign': 'error',
      'no-prototype-builtins': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error'
    }
  }
];