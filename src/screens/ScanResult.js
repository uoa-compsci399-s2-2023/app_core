import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Screen } from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ScanResult({ route, navigation }) {
  // TODO: Uncomment for Actual scanned Data
  // const { scannedText } = route.params;

  const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  // TODO: useState() should take {scannedText}
  const [text, setText] = useState(placeholderText);
  const [editing, setEditing] = useState(false);

  const toggleEditing = () => {
    setEditing(!editing);
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Scan',
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15}}
          onPress={toggleEditing}
        >
          <Icon name={editing ? 'save': 'edit'} size={30} color={editing ? '#16CD9A' : 'grey'} />
        </TouchableOpacity>
      )
    })
  }, [navigation, editing]);

  return (
      <Screen>
        <View style={styles.container}>
          {editing ? (
            <ScrollView>
              <TextInput
                style={[styles.textInput]}
                value={text}
                onChangeText={setText}
                multiline
                autoFocus={editing}
              />
            </ScrollView>
          ) : (
              <ScrollView>
                {/* <Text style={styles.scanText}>{ scannedText }</Text> */}

                {/* Note: Test styling using placeholder text. Will be applied to {scannedText} */}
                <Text style={styles.scanText}>{ text }</Text>
              </ScrollView>            
            )}

            {!editing && (
                // TODO: Navigates to Next Screen. Temp fill
                <TouchableOpacity
                  onPress={() => navigation.navigate('Scan')}
                  style={[styles.button,
                  {backgroundColor: '#3E989B'}]}
                >
                  <Text style={styles.buttonText}>Confirm Scan</Text>
                </TouchableOpacity>
            )}

        </View>
      </Screen>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fcfefe'
  },

  scanText: {
    fontSize: 18,
    padding: 20,
    backgroundColor: '#F1FEFB',
  },

  textInput: {
    padding: 14,
    fontSize: 18,
  },

  button: {
    padding: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }

});
