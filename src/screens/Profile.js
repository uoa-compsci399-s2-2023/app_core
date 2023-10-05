import * as React from "react";
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import {Screen} from "../components/Layout";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login({ navigation}) {

  const [ preferredUserName, setPreferredUserName ] = React.useState('');

  React.useEffect(() => {
    async function initializeProfile() {
      const preferredUserName = await SecureStore.getItemAsync('preferredUserName');
      setPreferredUserName(preferredUserName);
    }
    initializeProfile();
  }, [])

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('preferredUserName');
      await SecureStore.deleteItemAsync('accessToken');
      
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Screen>
      <View style={styles.view}>
        <View>
          <View style={styles.profileIcon}>
            <Icon
              name='user-circle'
              type="font-awesome"
              size={150}
              color={'grey'}
            />
            <Text style={styles.userNameText}>{ preferredUserName }</Text>
          </View>
        </View>
        <View>
          <Text style={styles.settingsHeader}>Settings</Text>
          <View style={[styles.settingsItemContainer, styles.spaceBottom]}>
            <Text style={styles.settingsItemHeader}>Dark Mode: </Text>
            <Switch
              value={false}
              disabled={true}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <Text style={styles.settingsItemHeader}>Tokens: </Text>
          <View style={styles.settingsItemContainer}>
            <Text >File Name: </Text>
            <TextInput style={styles.input} value="Title:" editable={false} />
          </View>
          <View style={styles.settingsItemContainer}>
            <Text>Folder: </Text>
            <TextInput style={styles.input} value="Folder:" editable={false} />
          </View>
          <View style={styles.settingsItemContainer}>
            <Text>Task: </Text>
            <TextInput style={styles.input} value="#" editable={false} />
          </View>
          <View style={styles.settingsItemContainer}>
            <Text>Task Due Date: </Text>
            <TextInput style={styles.input} value="@" editable={false} />
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#EBEBE4',
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
    width: '50%',
  },
  logoutButton: {
    color: 'red',
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 50,
    textAlign: 'center',
  },
  profileIcon: {
    alignItems: 'center',
    marginTop: 30,
  },
  settingsHeader: {
    fontSize: 28,
    marginBottom: 20,
  },
  settingsItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  settingsItemHeader: {
    fontSize: 20,
  },
  spaceBottom: {
    marginBottom: 20,
  },
  userNameText: {
    fontSize: 20,
    marginTop: 10,
  },
  view: {
    height: "100%",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  }
});
