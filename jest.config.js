const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    verbose: true
};
