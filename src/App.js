import React from "react";
import registerRootComponent from "expo/build/launch/registerRootComponent";

import { StatusBar } from 'expo-status-bar';
import { Screen } from "./components/Layout";

import Login from "./screens/Login";

function App() {
  return (
    <Screen>
      <StatusBar></StatusBar>
      <Login/>
    </Screen>
  );
}

registerRootComponent(App);