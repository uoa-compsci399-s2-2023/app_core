import React from "react";
import {View, Image} from "react-native";

import {Screen} from "../components/Layout";
import {LoginButton} from "../components/Buttons";

export default function Login() {

  const viewStyle = {
    alignItems: 'center'
  }

  return (
    <Screen>
      {/* Todo: Use SVG instead of PNG, I couldn't get SVGs to work and gave up for now 😢. */}
      <View flexDirection='column' gap={20} style={viewStyle}>
        <Image source={require("../../assets/logo/tabs.png")}/>
        <LoginButton text="Sign in with Microsoft" icon={require("../../assets/icons/microsoft.png")}/>
        <LoginButton text="Sign in with Google" icon={require("../../assets/icons/google.png")}/>
      </View>
    </Screen>
  );
}
