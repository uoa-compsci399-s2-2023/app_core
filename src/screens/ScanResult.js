import React from "react";

import {Text, StyleSheet} from "react-native";
import { Screen } from "../components/Layout";

export default function ScanResult({ route }) {
  // const { scannedText } = route.params;

  return (
    <Screen>
      <Text style={styles.titleText}>Scan Results:</Text>
      {/* <Text>{ scannedText }</Text> */}
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});