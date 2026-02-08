# Detox setup (skeleton)

This repo is Expo managed, so Detox requires a native build (prebuild or EAS dev client).

## Option A — Local prebuild (iOS)
1) `npx expo prebuild -p ios`
2) `yarn e2e:build:ios`
3) `yarn e2e:ios`

## Option B — EAS dev build
1) Create a dev build: `eas build --profile development --platform ios`
2) Install on simulator/device
3) Update `binaryPath` in `detox.config.js` to point to the built `.app`
4) `yarn e2e:ios`

## Notes
- E2E tests are in `e2e/`
- Current test only launches the app; add assertions once testIDs are added.
