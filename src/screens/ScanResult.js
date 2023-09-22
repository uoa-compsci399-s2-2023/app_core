import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';
import {scaledSize} from "../Theme.js";

export default function ScanResult({ route, navigation }) {
  const { scannedText } = route.params;
  const [text, setText] = useState(scannedText);
  const [editing, setEditing] = useState(false);

  const toggleEditing = () => {
    setEditing(!editing);
  }

  const renderEditOption = () => (
    <TouchableOpacity
      style={styles.editOptions }
      onPress={toggleEditing}
    >
      <Icon name={editing ? 'save': 'edit'} size={30} color={editing ? '#16CD9A' : 'grey'} />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Scan',
      headerRight: renderEditOption
    })
  }, [navigation, editing]
  );

  return (
    <Screen>
      <View style={styles.container}>
        {editing ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView keyboardDismissMode='on-drag'>
              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                multiline={true}
                autoFocus={true}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
              <Text style={styles.scanText}>{ text }</Text>
            </ScrollView>   
          </KeyboardAvoidingView>
        )}
      </View>

      {!editing && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Tokens Detected', { scannedText: text })}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Confirm Scan</Text>
        </TouchableOpacity>
      )}
    </Screen>
  );
}






const styles = StyleSheet.create({

  button: {
    alignItems: 'center',
    backgroundColor: '#3E989B',
    padding:  scaledSize(16),
  },

  buttonText: {
    color: 'white',
    fontSize: scaledSize(16),
    fontWeight: 'bold'
  },

  container: {
    backgroundColor: '#fcfefe',
    flex: 1,
  },

  editOptions: {
    marginRight: "5%"
  },

  scanText: {
    backgroundColor: '#F1FEFB',
    fontSize: scaledSize(18),
    padding: "5%",
  },

  textInput: {
    fontSize: scaledSize(18),
    padding: "5%",
    paddingBottom: "100%" // not 100% sure why i have to force it to 100 to make it work??
  },

});
