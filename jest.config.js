module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/shared/local/**/*.{ts,tsx}",
    "src/shared/utils/**/*.{ts,tsx}",
    "src/shared/constants/**/*.{ts,tsx}",
    "src/shared/data/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/index.ts",
    "!src/**/index.tsx",
    "!src/shared/local/db.ts",
    "!src/shared/local/db.native.ts",
    "!src/shared/local/db.web.ts",
    "!src/shared/local/storageAdapter.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?|@react-navigation|react-navigation|@sentry|sentry-expo|@unimodules|unimodules|react-native-paper|react-native-vector-icons|react-native-gesture-handler|react-native-reanimated|react-native-svg)"
  ],
};
