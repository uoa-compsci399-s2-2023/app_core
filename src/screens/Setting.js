import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../components/AppContext';
import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Setting({ navigation }) {
  const tokens = useContext(AppContext);

  const [FileName, setFileName] = useState(tokens.FileName);
  const [folderToken, setfolder] = useState(tokens.folderToken);
  const [taskToken, setTasktoken] = useState(tokens.taskToken);
  const [dueDateToken, setdueDateToken] = useState(tokens.dueDateToken);

  useEffect(() => {
    async function initializeTokens() {
      const FileName = await AsyncStorage.getItem('FileName1Local')|| 'file name';
      const folderToken = await AsyncStorage.getItem('folderTokenLocal') || 'folder';
      const taskToken = await AsyncStorage.getItem('taskTokenLocal') || '#';
      const dueDateToken = await AsyncStorage.getItem('dueDateTokenLocal') || '@';
      setFileName(FileName);
      setfolder(folderToken);
      setTasktoken(taskToken);
      setdueDateToken(dueDateToken);
    }
    initializeTokens();
  }, [])

  const saveSettings = async () => {
    tokens.setFileName(FileName.toLowerCase() || 'file name');
    tokens.setfolder(folderToken.toLowerCase() || 'folder');
    tokens.setTasktoken(taskToken.toLowerCase() || '#');
    tokens.setdueDateToken(dueDateToken.toLowerCase() || '@');
    try {
      await AsyncStorage.setItem('FileName1Local', FileName.toLowerCase() || 'file name');
      await AsyncStorage.setItem('folderTokenLocal', folderToken.toLowerCase() || 'folder');
      await AsyncStorage.setItem('taskTokenLocal', taskToken.toLowerCase() || '#');
      await AsyncStorage.setItem('dueDateTokenLocal', dueDateToken.toLowerCase() || '@');
    } catch (error) {
      console.log(error);
    }
    navigation.goBack();
  }

  return (
    <Screen>
      <View>
        <View>
          <Text style={styles.inputField}>File Name Token</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setFileName}
            value={FileName}
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
        <View>
          <Text style={styles.inputField}>Due Date Token</Text>
          <TextInput
            style={styles.inputContainer}
            onChangeText={setdueDateToken}
            value={dueDateToken}
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

