import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons'; 
import { View, StyleSheet, Pressable, Text } from 'react-native';

import { Screen } from "../components/Layout";

export default function Scan({ navigation }) {

  const styles = StyleSheet.create({
    configIcon: {
      marginLeft: 20,
      marginTop: 20,
    }
  });

  const [ awsAccessKeyId, setAwsAccessKeyId ] = useState('');
  const [ awsSecretAccessKey, setAwsSecretAccessKey ] = useState('');

  useEffect(() => {
    async function initializeCreds() {
      const awsAccessKeyId = await SecureStore.getItemAsync('awsAccessKeyId');
      const awsSecretAccessKey = await SecureStore.getItemAsync('awsSecretAccessKey');
      setAwsAccessKeyId(awsAccessKeyId);
      setAwsSecretAccessKey(awsSecretAccessKey);
    }
    initializeCreds();
  }, [])

  return (
    <Screen>
      <View style={ styles.configIcon }>
        <Pressable onPress={() => navigation.navigate('Config')}>
          <FontAwesome name="gear" size={40} color="black" />
        </Pressable>
        <Text>{ awsAccessKeyId }</Text>
        <Text>{ awsSecretAccessKey }</Text>
      </View>
    </Screen>
  );
}