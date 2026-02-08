module.exports = {
  preset: "jest-expo",
  rootDir: "..",
  testMatch: ["<rootDir>/e2e/**/*.e2e.ts"],
  setupFilesAfterEnv: ["<rootDir>/e2e/init.js"],
  testTimeout: 120000,
};
