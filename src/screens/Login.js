import * as React from "react";
import * as SecureStore from 'expo-secure-store';
import { View, Image, StyleSheet} from "react-native";
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
      scopes: ['User.Read','openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );

  const [accessToken, setAccessToken] = React.useState(String|null);

  React.useEffect(() => {
    async function currentAccessToken() {
      const accessToken  = await SecureStore.getItemAsync('accessToken');
      setAccessToken(accessToken);
    }
    currentAccessToken()
  }, [])

  const saveAccessToken = async (accessToken) => {
    setAccessToken(accessToken);
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
                  setAccessToken(res.accessToken); //has refresh token in res
                  saveAccessToken(accessToken);
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
