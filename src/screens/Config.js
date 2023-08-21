import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Text, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { Screen } from "../components/Layout";

export default function Config({ navigation }) {

  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');

  useEffect(() => {
    async function initializeCreds() {
      const awsAccessKeyId = await SecureStore.getItemAsync('awsAccessKeyId');
      const awsSecretAccessKey = await SecureStore.getItemAsync('awsSecretAccessKey');
      setAwsAccessKeyId(awsAccessKeyId);
      setAwsSecretAccessKey(awsSecretAccessKey);
    }
    initializeCreds();
  }, [])

  const persistConfig = async () => {
    await SecureStore.setItemAsync('awsAccessKeyId', awsAccessKeyId);
    await SecureStore.setItemAsync('awsSecretAccessKey',awsSecretAccessKey);
    navigation.goBack();
  }

  return (
    <Screen>
      <Text>AWS Access Key ID: </Text>
      <TextInput
        style={styles.input}
        onChangeText={setAwsAccessKeyId}
        value={awsAccessKeyId}
      />
      <Text>AWS Secret Access Key: </Text>
      <TextInput
        style={styles.input}
        onChangeText={setAwsSecretAccessKey}
        value={awsSecretAccessKey}
      />
      <Button
        onPress={persistConfig}
        title="Submit"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
  },
});