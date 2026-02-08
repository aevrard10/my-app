/**
 * Detox configuration
 *
 * Requires a dev build (Expo prebuild or EAS) to generate native projects.
 */
module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/jest.config.js",
  apps: {
    "ios.sim.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/reptiTrack.app",
      build:
        "xcodebuild -workspace ios/reptiTrack.xcworkspace -scheme reptiTrack -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 15",
      },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.sim.debug",
    },
  },
};
