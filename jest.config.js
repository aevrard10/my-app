module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/index.ts",
    "!src/**/index.tsx",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?|@react-navigation|react-navigation|@sentry|sentry-expo|@unimodules|unimodules|react-native-paper|react-native-vector-icons|react-native-gesture-handler|react-native-reanimated|react-native-svg)"
  ],
};
