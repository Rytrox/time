import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import {configs as tslint} from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig({
    files: ["**/*.ts"],
    extends: [
        eslint.configs.all,
        ...tslint.strict,
        stylistic.configs.customize({
            jsx: false,
            arrowParens: false,
            quotes: 'single',
            semi: true,
            indent: 4,
            quoteProps: 'consistent-as-needed',
            braceStyle: '1tbs',
            commaDangle: 'never',
        }),
    ],
    rules: {
        '@stylistic/operator-linebreak': [
            'error',
            'after'
        ],
        "@stylistic/arrow-parens": [
            "error",
            "as-needed"
        ],
        "one-var": 'off',
        "no-magic-numbers": 'off',
        "no-ternary": 'off',
        "id-length": 'off',
        "no-shadow": 'off',
        "max-params": 'off',
        "max-statements": 'off',
        "max-lines-per-function": 'off',
        'init-declarations': 'off',
        'max-lines': 'off',
        'prefer-destructuring': 'off'
    }
})
