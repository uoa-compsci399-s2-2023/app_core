import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';

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

        {!editing && (
          <TouchableOpacity
            onPress={() => navigation.navigate('TokensDetected', { scannedText: text })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Confirm Scan</Text>
          </TouchableOpacity>
        )}

      </View>
    </Screen>
  );
}






const styles = StyleSheet.create({

  button: {
    alignItems: 'center',
    backgroundColor: '#3E989B',
    padding: 16,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  container: {
    backgroundColor: '#fcfefe',
    flex: 1,
  },

  editOptions: {
    marginRight: 15
  },

  scanText: {
    backgroundColor: '#F1FEFB',
    fontSize: 18,
    padding: 20,
  },

  textInput: {
    fontSize: 18,
    padding: 14,
    paddingBottom: 320
  },

});
