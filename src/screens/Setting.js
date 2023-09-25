import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Setting({ navigation }) {

  let [FileName1, setFileName1] = useState('Title');
  let [FileName2, setFileName2] = useState('file name');
  let [folderToken, setfolder] = useState('folder');
  let [taskToken, setTasktoken] = useState('#');

  useEffect(() => {
    async function initializeCreds() {
      let FileName1 = await AsyncStorage.getItem('FileName1Local');
      let FileName2 = await AsyncStorage.getItem('FileName2Local');
      let folderToken = await AsyncStorage.getItem('folderTokenLocal');
      let taskToken = await AsyncStorage.getItem('taskTokenLocal');
      setFileName1(FileName1);
      setFileName2(FileName2);
      setfolder(folderToken);
      setTasktoken(taskToken);
    }
    initializeCreds();
  }, [])

  const saveSettings = async () => {
    FileName1 = FileName1 || 'Title';
    FileName2 = FileName2 || 'file name';
    folderToken = folderToken || 'folder';
    taskToken = taskToken || '#'
    try {
      await AsyncStorage.setItem('FileName1Local', FileName1);
      await AsyncStorage.setItem('FileName2Local', FileName2);
      await AsyncStorage.setItem('folderTokenLocal', folderToken);
      await AsyncStorage.setItem('taskTokenLocal', taskToken);
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  }

  return (
    <Screen>
      <View>
        <View>
          <Text style={styles.inputField}>File Name Token 1</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setFileName1}
            value={FileName1}
          />
        </View>
        <View>
          <Text style={styles.inputField}>File Name Token 2</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setFileName2}
            value={FileName2}
          />
        </View>
        <View >
          <Text style={styles.inputField}>Folder Token</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setfolder}
            value={folderToken}
          />
        </View>
        <View>
          <Text style={styles.inputField}>Task Token</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setTasktoken}
            value={taskToken}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={saveSettings}
        style={styles.button}
      >
        <Icon name="save" style={styles.buttonText}> save</Icon>
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
  }
});

