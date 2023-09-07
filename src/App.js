// Getting a "URL.hostname is not implemented" error when calling AWS Textract. Fix here:
// https://stackoverflow.com/questions/70413410/error-url-hostname-is-not-implemented-aws-sns-in-react-native-android
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from "react";

import registerRootComponent from "expo/build/launch/registerRootComponent";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Splash from './screens/Splash';
import Login from "./screens/Login";
import Scan from './screens/Scan';
import Config from './screens/Config';
import ScanResult from './screens/ScanResult';
import TokensDetected from './screens/Tokensdetected';

const Stack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Config" component={Config} options={{headerTitleAlign: 'center'}} />
        <Stack.Screen name="Scan" component={Scan} options={{headerShown: false}} initialParams={{ retakeMode: false }}/>
        <Stack.Screen name="Scan Result" component={ScanResult} options={{headerTitleAlign: 'center'}} />
        <Stack.Screen name="Tokens Detected" component={TokensDetected} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);