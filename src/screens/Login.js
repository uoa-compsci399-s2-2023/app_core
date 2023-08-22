import React from "react";

import {View, Image, StyleSheet} from "react-native";
import {LoginButton} from "../components/Buttons";
import { Screen } from "../components/Layout";

export default function Login({ navigation }) {

  const styles = StyleSheet.create({
    view: {
      alignItems: "center",
      height: "100%",
      justifyContent: "center",
      width: "100%",
    }
  });

  return (
    <Screen>
      <View flexDirection='column' gap={20} style={styles.view}>
        {/* Todo: Use SVG instead of PNG, I couldn't get SVGs to work and gave up for now 😢. */}
        <Image source={require("../../assets/logo/tabs.png")}/>
        <LoginButton
          text="Sign in with Microsoft" 
          icon={require("../../assets/icons/microsoft.png")}
          onPress={() =>
            navigation.navigate('Scan')
          }
        />
        <LoginButton text="Sign in with Google" icon={require("../../assets/icons/google.png")}/>
      </View>
    </Screen>
  );
}