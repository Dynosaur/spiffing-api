const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

function createProject(name, path, other) {
    return {
        displayName: name,
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        testMatch: [`<rootDir>/tests/${path}/**/*.ts`],
        transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
        ...other
    }
}

module.exports = {
    projects: [
        createProject('unit-tests', 'unit'),
        createProject('unit-tests/mock', 'unit/mock-tests'),
        createProject('unit-tests/router', 'unit/router-tests'),
        createProject('integration-tests', 'integration'),
        createProject('validation-tests', 'validation')
    ]
};
