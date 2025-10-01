/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],

    testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],

    watchPathIgnorePatterns: [
        '<rootDir>/coverage/',
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/.prisma/',
        '<rootDir>/prisma/',
        '<rootDir>/tmp/',
        '<rootDir>/*.db',
        '<rootDir>/.docker/',
    ],
}

export default config
