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
import Login from './screens/Login';
import Scan from './screens/Scan';
import Config from './screens/Config';
import Setting from './screens/Setting';
import ScanResult from './screens/ScanResult';
import TokensDetected from './screens/Tokensdetected';

const Stack = createNativeStackNavigator();

function App() {

  const [FileName, setFileName] = useState('file name');
  const [folderToken, setfolder] = useState('folder');
  const [taskToken, setTasktoken] = useState('#');
  const [dueDateToken, setdueDateToken] = useState('@');

  useEffect(() => {
    async function initializeTokens() {
      const FileName = await AsyncStorage.getItem('FileName1Local');
      const folderToken = await AsyncStorage.getItem('folderTokenLocal');
      const taskToken = await AsyncStorage.getItem('taskTokenLocal');
      const dueDateToken = await AsyncStorage.getItem('dueDateTokenLocal');
      setFileName(FileName);
      setfolder(folderToken);
      setTasktoken(taskToken);
      setdueDateToken(dueDateToken);
    }
    initializeTokens();
  }, [])

  const Settings = {
    FileName: FileName,
    folderToken: folderToken,
    taskToken: taskToken,
    dueDateToken: dueDateToken,
    setFileName,
    setfolder,
    setTasktoken,
    setdueDateToken
  };

  return (
    <AppContext.Provider value={Settings}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}  />
          <Stack.Screen name="Scan" component={Scan} options={{headerTitleAlign: 'center',  headerShown: true, title: '' }} initialParams={{ retakeMode: false }}  />
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