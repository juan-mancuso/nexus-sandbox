/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	testEnvironmentOptions: {
		NODE_ENV: 'test'
	},
	restoreMocks: true,
	coveragePathIgnorePatterns: ['node_modules', 'dist/config', 'dist/tests', 'dist/app.js'],
	coverageReporters: ['text', 'lcov', 'clover', 'html'],
	modulePathIgnorePatterns: ['dist'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				diagnostics: false,
				tsconfig: 'tsconfig.test.json'
			}
		],
		'^.+\\.jsx?$': [
			'ts-jest',
			{
				diagnostics: false,
				tsconfig: 'tsconfig.test.json'
			}
		]
	},
	moduleNameMapper: {
		'^axios$': require.resolve('axios'),
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	detectOpenHandles: true,
	forceExit: true,
	testPathIgnorePatterns: ['/__tests__/__mocks__/'],
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!**/node_modules/**', '!**/__tests__/**'],
	coveragePathIgnorePatterns: ['/node_modules/', '\\.json$', '/__tests__/']
};
