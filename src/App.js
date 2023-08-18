import React from "react";

import registerRootComponent from "expo/build/launch/registerRootComponent";
import {GluestackUIProvider, config} from "@gluestack-ui/react";

import Login from "./screens/Login";

function App() {
  return (
    <GluestackUIProvider config={config.theme}>
      {/* Todo: Show camera screen straight away if user is already logged in. */}
      <Login/>
    </GluestackUIProvider>
  );
}

registerRootComponent(App);