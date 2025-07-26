import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
    {
        ignores: ['dist', 'node_modules', 'build', '.env*'],
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                process: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            // React specific rules
            'react/jsx-uses-react': 'off', // Not needed in React 17+
            'react/react-in-jsx-scope': 'off', // Not needed in React 17+
            'react/jsx-uses-vars': 'error',
            'react/prop-types': 'off', // We're not using PropTypes

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // React Refresh rules
            'react-refresh/only-export-components': 'warn',

            // General JS rules
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true
            }],
            'no-console': 'off', // Allow console statements
            'no-debugger': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',

            // Allow some flexibility for development
            'no-undef': 'error',
            'no-redeclare': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
