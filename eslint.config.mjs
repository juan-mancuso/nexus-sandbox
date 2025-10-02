import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import jestPlugin from 'eslint-plugin-jest';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
	baseDirectory: dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: ['**/node_modules', '**/dist']
	},
	...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint
		},
		languageOptions: {
			parser: tsParser
		},
		rules: {
			'no-const-assign': 'error',
			'linebreak-style': ['error', 'unix'],
			indent: [
				'error',
				'tab',
				{
					offsetTernaryExpressions: true,
					SwitchCase: 1
				}
			],
			semi: ['error', 'always'],
			quotes: [
				'error',
				'single',
				{
					avoidEscape: true
				}
			],
			'arrow-parens': ['error', 'always'],
			'no-console': 'error',
			curly: 'error',
			eqeqeq: 'error',
			'no-empty': 'error',
			'no-else-return': 'error',
			'no-extend-native': 'error',
			'no-multi-spaces': 'error',
			'no-param-reassign': 'error',
			'no-self-compare': 'error',
			'no-undef-init': 'error',
			'no-use-before-define': 'error',
			'no-eval': 'error',
			'no-new-func': 'error',
			'no-implied-eval': 'error',
			'no-script-url': 'error',
			'no-template-curly-in-string': 'error',
			'no-throw-literal': 'error',
			'no-unused-expressions': 'error',
			'no-useless-call': 'error',
			'no-useless-catch': 'error',
			'no-void': 'error',
			'prefer-const': 'error',
			radix: 'error',
			'no-caller': 'error',
			'no-sequences': 'error',
			'no-floating-decimal': 'error',
			'no-new-wrappers': 'error',
			'no-restricted-globals': ['error', 'event', 'fdescribe'],
			'no-unsafe-negation': 'error',
			'func-names': ['error', 'as-needed'],
			'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
			'consistent-return': 'error',
			'@typescript-eslint/no-require-imports': 'error',
			'@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
			'@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
			'@typescript-eslint/no-explicit-any': [
				'warn',
				{
					ignoreRestArgs: true
				}
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'padding-line-between-statements': [
				'error',

				// After directives (like 'use-strict'), except between directives
				{ blankLine: 'always', prev: 'directive', next: '*' },
				{ blankLine: 'any', prev: 'directive', next: 'directive' },

				// After imports, except between imports
				{ blankLine: 'always', prev: 'import', next: '*' },
				{ blankLine: 'any', prev: 'import', next: 'import' },

				// Before and after every sequence of variable declarations
				{ blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
				{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
				{ blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },

				// Before and after class declaration, if, while, switch, try
				{ blankLine: 'always', prev: '*', next: ['class', 'if', 'while', 'switch', 'try'] },
				{ blankLine: 'always', prev: ['class', 'if', 'while', 'switch', 'try'], next: '*' },

				// Before return statements
				{ blankLine: 'always', prev: '*', next: 'return' }
			]
		}
	},
	{
		files: ['**/**/*.{js,cjs,mjs}'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		},
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				...globals.node,
				...globals.commonjs
			}
		}
	},
	{
		plugins: { jest: jestPlugin },
		languageOptions: {
			globals: jestPlugin.environments.globals.globals
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			...jestPlugin.configs.recommended.rules
		},
		files: ['**/jest.*', '**/*.test.{js,ts}', '**/*.spec.{js,ts}']
	}
];
