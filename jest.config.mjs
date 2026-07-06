import {createJsWithTsEsmPreset} from "ts-jest";

const tsJestTransformCfg = createJsWithTsEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest/presets/default-esm', // ESM Preset nutzen
  testEnvironment: 'node',
  transform: tsJestTransformCfg,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'cobertura'],
};