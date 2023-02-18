/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  reporters: ["default", "github-actions"],
  coverageReporters: ["lcov", "text-summary", "json"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*",
  ],
  modulePaths: ["<rootDir>"],
};

