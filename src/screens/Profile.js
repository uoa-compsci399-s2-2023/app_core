import * as React from "react";
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  userNameText: {
    fontSize: 20,
    marginTop: 10,
  },
  view: {
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
  },
});
