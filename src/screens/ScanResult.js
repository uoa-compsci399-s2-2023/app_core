import React from "react";

import {Text, StyleSheet} from "react-native";
import { Screen } from "../components/Layout";

export default function ScanResult({ route }) {
  const { scannedText } = route.params;

  return (
    <Screen>
      <Text style={styles.titleText}>Scan Results:</Text>
      <Text>{ scannedText }</Text>
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