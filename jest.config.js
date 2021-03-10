const { randomBytes } =             require('crypto');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } =         require('./tsconfig');

process.env.environment = 'TEST';
process.env.KEY = randomBytes(32).toString('hex');

function createProject(name, path, serial = false, other) {
    return {
        displayName: name,
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        testMatch: [`<rootDir>/tests/${path}/**/*.test.ts`],
        transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
        ...serial && { runner: 'jest-serial-runner' },
        ...other
    }
}

module.exports = {
    projects: [
        createProject('all', '', true),
        createProject('integration-tests', 'integration', true),
        createProject('unit-tests', 'unit'),
        createProject('validation-tests', 'validation', true),
    ]
};
