const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

function createProject(name, path, serial = false, other) {
    return {
        displayName: name,
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        testMatch: [`<rootDir>/tests/${path}/**/*.ts`],
        transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
        ...serial && { runner: 'jest-serial-runner' },
        ...other
    }
}

module.exports = {
    projects: [
        createProject('integration-tests', 'integration', true),
        createProject('unit-tests', 'unit'),
        createProject('unit-tests/mock', 'unit/mock-tests'),
        createProject('unit-tests/router', 'unit/router-tests'),
        createProject('unit-tests/router/api', 'unit/router-tests/api-router-tests', true),
        createProject('unit-tests/database', 'unit/database-tests'),
        createProject('validation-tests', 'validation', true)
    ]
};
