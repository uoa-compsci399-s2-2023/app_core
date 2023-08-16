import * as gs from "@gluestack-ui/react";
import * as rn from "react-native";

import React from "react";
import registerRootComponent from "expo/build/launch/registerRootComponent";

function App() {
  return (
    <gs.GluestackUIProvider config={gs.config.theme}>
      <gs.Center bg='#101010' h='100%' w='100%'>
        <rn.View flexDirection='column' gap={20} width='70%'>
          <gs.Text textAlign='center' color='#909090'
          >Hey there, Delilah What's it like in New York city? {"\n"}
                        I'm a thousand miles away But, girl, tonight you look so pretty {"\n"}
                        Yes, you do  {"\n"}
                        Time square can't shine as bright as you I swear, it's true
          </gs.Text>
          <gs.Spinner size="large" />
          <gs.Button
            size="md"
            variant="solid"
            action="primary"
          >
            <gs.ButtonText>Press Me</gs.ButtonText>
          </gs.Button>
        </rn.View>
      </gs.Center>
    </gs.GluestackUIProvider>
  );
}

registerRootComponent(App);