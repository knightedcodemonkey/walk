import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nodePlugin from 'eslint-plugin-n'

export default tseslint.config(
  eslint.configs.recommended,
  nodePlugin.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      'n/no-missing-import': [
        'error',
        {
          allowModules: ['estree'],
        },
      ],
      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          ignores: [
            // No longer experimental with v22.0.0
            'test.describe',
          ],
        },
      ],
    },
  },
)
