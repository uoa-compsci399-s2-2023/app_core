import * as React from "react";
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { View, Image, StyleSheet } from "react-native";
import {LoginButton} from "../components/Buttons";
import {Screen} from "../components/Layout";

import {exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery, } from "expo-auth-session";

export default function Login({ navigation}) {
  
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/common/v2.0",
  );

  const redirectUri = makeRedirectUri({
    native: "exp://redirect",
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
                  const decodedIdToken = jwtDecode(res.idToken);
                  SecureStore.setItemAsync('preferredUserName', decodedIdToken.preferred_username);
                  SecureStore.setItemAsync('accessToken', res.accessToken);
                  navigation.navigate('Scan')
                });
              }
            })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  }
});
