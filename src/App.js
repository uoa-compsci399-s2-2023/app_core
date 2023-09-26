// Getting a "URL.hostname is not implemented" error when calling AWS Textract. Fix here:
// https://stackoverflow.com/questions/70413410/error-url-hostname-is-not-implemented-aws-sns-in-react-native-android
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import AppContext from './components/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerRootComponent from "expo/build/launch/registerRootComponent";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Login from "./screens/Login";
import Scan from './screens/Scan';
import Config from './screens/Config';
import Setting from './screens/Setting';
import ScanResult from './screens/ScanResult';
import TokensDetected from './screens/Tokensdetected';

const Stack = createNativeStackNavigator();

function App() {

  const [FileName1, setFileName1] = useState('title');
  const [FileName2, setFileName2] = useState('file name');
  const [folderToken, setfolder] = useState('folder');
  const [taskToken, setTasktoken] = useState('#');

  useEffect(() => {
    async function initializeTokens() {
      const FileName1 = await AsyncStorage.getItem('FileName1Local');
      const FileName2 = await AsyncStorage.getItem('FileName2Local');
      const folderToken = await AsyncStorage.getItem('folderTokenLocal');
      const taskToken = await AsyncStorage.getItem('taskTokenLocal');
      setFileName1(FileName1);
      setFileName2(FileName2);
      setfolder(folderToken);
      setTasktoken(taskToken);
    }
    initializeTokens();
  }, [])

  const Settings = {
    FileName1: FileName1,
    FileName2: FileName2,
    folderToken: folderToken,
    taskToken: taskToken,
    setFileName1,
    setFileName2,
    setfolder,
    setTasktoken,
  };

  return (
    <AppContext.Provider value={Settings}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: true, title: '', headerBackVisible: false, headerTransparent: true }} />
          <Stack.Screen name="Scan" component={Scan} options={{ headerShown: false }} initialParams={{ retakeMode: true }} />
          <Stack.Screen name="Setting" component={Setting} options={{ headerTitleAlign: 'center' }} />
          <Stack.Screen name="Config" component={Config} options={{ headerTitleAlign: 'center' }} />
          <Stack.Screen name="Scan Result" component={ScanResult} options={{ headerTitleAlign: 'center' }} />
          <Stack.Screen name="Tokens Detected" component={TokensDetected} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

registerRootComponent(App);