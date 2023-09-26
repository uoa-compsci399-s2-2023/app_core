import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Text, Button, View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Config({ navigation }) {

  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const placeholderText = "Title : pass\n #pass \n folder : pass \n";
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
    await SecureStore.setItemAsync('awsSecretAccessKey', awsSecretAccessKey);
    navigation.goBack();
  }

  const toggleKeyVisibility = () => {
    setShowAccessKey(!showAccessKey);
  }

  return (
    <Screen>
      <Button
        onPress={() =>
          navigation.navigate('Scan Result', {
            scannedText: placeholderText,
          })}
        title="Results Screen Bypass"
      />
      <Button
        onPress={() =>
          navigation.navigate('Scan')}
        title="Login Bypass"
      />
      <View>
        <Text style={styles.inputField}>AWS Access Key ID</Text>
        <TextInput
          style={styles.inputContainer}
          onChangeText={setAwsAccessKeyId}
          value={awsAccessKeyId}
        />
        <Text style={styles.inputField}>AWS Secret Access Key</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputKey}
            placeholder="Enter your Access Key"
            secureTextEntry={!showAccessKey}
            onChangeText={setAwsSecretAccessKey}
            value={awsSecretAccessKey}
          />
          <TouchableOpacity onPress={toggleKeyVisibility}>
            <Icon
              name={showAccessKey ? 'eye-slash' : 'eye'}
              type="font-awesome"
              size={24}
              style={styles.icon}
              color={'grey'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={persistConfig}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#3E989B',
    marginTop: 40,
    padding: 16,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  icon: {
    marginLeft: 20,
    marginRight: 5
  },

  inputContainer: {
    alignItems: 'center',
    borderColor: 'grey',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 10,
  },

  inputField: {
    color: 'grey',
    fontSize: 18,
    marginTop: 14,
    padding: 10,
  },

  inputKey: {
    flex: 1,
    height: 40,
  },

});