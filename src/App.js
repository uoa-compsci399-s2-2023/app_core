// Getting a "URL.hostname is not implemented" error when calling AWS Textract. Fix here:
// https://stackoverflow.com/questions/70413410/error-url-hostname-is-not-implemented-aws-sns-in-react-native-android
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from "react";
import registerRootComponent from "expo/build/launch/registerRootComponent";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from "./screens/Login";
import Scan from './screens/Scan';
import Config from './screens/Config';
import ScanResult from './screens/ScanResult';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Config" component={Config} />
        <Stack.Screen name="ScanResult" component={ScanResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);