import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../components/AppContext';
import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Setting({ navigation }) {
  const tokens = useContext(AppContext);

  const [FileName1, setFileName1] = useState(tokens.FileName1);
  const [FileName2, setFileName2] = useState(tokens.FileName2);
  const [folderToken, setfolder] = useState(tokens.folderToken);
  const [taskToken, setTasktoken] = useState(tokens.taskToken);

  useEffect(() => {
    async function initializeTokens() {
      const FileName1 = await AsyncStorage.getItem('FileName1Local');
      const FileName2 = await AsyncStorage.getItem('FileName2Local');
      const folderToken = await AsyncStorage.getItem('folderTokenLocal');
      const taskToken = await AsyncStorage.getItem('taskTokenLocal');
      setFileName1(FileName1);
      setFileName2(FileName2);
      setfolder(folderToken);
      setTasktoken(taskToken);
    }
    initializeTokens();
  }, [])

  const saveSettings = async () => {
    tokens.setFileName1(FileName1);
    tokens.setFileName2(FileName2);
    tokens.setfolder(folderToken);
    tokens.setTasktoken(taskToken);
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

