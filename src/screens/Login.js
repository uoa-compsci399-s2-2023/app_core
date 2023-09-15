import React, { useContext } from "react";
import * as SecureStore from 'expo-secure-store';
import {View, Image, StyleSheet, Text} from "react-native";
import {LoginButton} from "../components/Buttons";
import {Screen} from "../components/Layout";
//import AppContext from '../components/AppContext';

import {exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery, getDefaultReturnUrl} from "expo-auth-session";

export default function Login({ navigation}) {
  
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/common/v2.0",
  );

  //const userSettings = useContext(AppContext);
  
  const redirectUri = makeRedirectUri({
    native: "Tabs://redirect",
    preferLocalhost: true, //Temp
  });

  const clientId = '7644da13-4be5-4c5c-860e-f068183aa631';

  const [request,, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access', 'files.readwrite', 'tasks.readwrite'],
      redirectUri,
    },
    discovery,
  );

  const saveAccessToken = async (accessToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
  }

  return (
    <Screen>
      <View flexDirection='column' gap={20} style={styles.view}>
        {/* Todo: Use SVG instead of PNG, I couldn't get SVGs to work and gave up for now 😢. */}
        <Image source={require("../../assets/logo/tabs.png")}/>
        <LoginButton
          text="Sign in with Microsoft" 
          icon={require("../../assets/icons/microsoft.png")}
          onPress={() =>
            promptAsync().then((codeResponse) => {
              if (request && codeResponse?.type === 'success' && discovery) {
                exchangeCodeAsync(
                  {
                    clientId,
                    code: codeResponse.params.code,
                    extraParams: request.codeVerifier
                      ? { code_verifier: request.codeVerifier }
                      : undefined,
                    redirectUri,
                  },
                  discovery,
                ).then((res) => {
                  saveAccessToken(res.accessToken);
                  navigation.navigate('Scan')
                });
              }
            })
          }
        />
        <LoginButton text="Sign in with Google" icon={require("../../assets/icons/google.png")}
          onPress={() =>
            navigation.navigate('Scan')
          }/>
        <Text style={styles.text} onPress={() => navigation.navigate('Config')}>{"Options (temp)"}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Temporary style for options text, this is only used to store
  text: {
    color: "#D0D0D0",
    fontSize: 24,
    fontWeight: "bold"
  },
  view: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  }
});
