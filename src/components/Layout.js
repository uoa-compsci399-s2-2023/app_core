import React from "react";
import {View, StyleSheet} from "react-native";

import {lightTheme} from "../Theme";

// Sets parent size to phone screen size and draw background. Base element for all screens.
export function Screen(props) {

  const styles = StyleSheet.create({
    screen: {
      backgroundColor: lightTheme.background,
      minHeight: "100%",
      width: "100%",
    }
  });

  return (
    <View style={styles.screen}>
      {props.children}
    </View>
  );
}
