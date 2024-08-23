const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  globalSetup: "<rootDir>/src/__tests__/jest/globalSetup.ts",
  globalTeardown: "<rootDir>/src/__tests__/jest/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest/setupFile.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/jest/"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/jest"],
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
};