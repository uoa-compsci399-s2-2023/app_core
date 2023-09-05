# app_core
Team 9 capstone project.

note: instructions right now are primitive, they will be updated later when time allows

## Setup
1) create an expo account [here]( https://expo.dev/signup).
2) wait until you are invited to the `team-9` organisation 
3) follow the steps listed [here](https://reactnative.dev/docs/environment-setup?os=macos#installing-dependencies), (`React native CLI -> Installing Dependencies` step only)
4) logout and login again or restart your computer
4) run `npm install` to install the node modules the app uses
5) log into your expo account using `expo login`

## Building
- To build the application run the following command `npm run build-android-{build type}` where `{build type}` is one of the build types defined below.
- your `.apk` should be found in the `./bin` folder
- install the APK onto your device or onto the Android simulator.

## Developing
- When developing the app use `dev-client` build or download Expo Go on your device.
1) Start the expo client using `npm run start-expo-client`
2) Open the `dev-client` app or Expo Go and connect to the client
3) Develop

## Build types

### `dev-client`
- builds the application with the expo client. 
- follow instructions presented on the app to connect the expo client to the app
- use `dev-client` when developing the application as it supports hot reloading

### `dev`
- builds the application with debug symbols
- this is what the CI will build

### `preview`
- builds the in release mode
- this is the build that will be released to clients for testing

## Android Studio simulator.
- follow [this](https://docs.expo.dev/workflow/android-studio-emulator/) guide to set up a simulator.
