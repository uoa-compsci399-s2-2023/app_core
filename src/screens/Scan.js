import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons'; 
import { View, StyleSheet, Pressable, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Buffer } from 'buffer';
import Spinner from 'react-native-loading-spinner-overlay';
import textract from '../textract';
import ScanModel from '../models/Scan';

import { Screen } from "../components/Layout";
import { Alert } from "../components/Modals.js";

export default function Scan({ navigation }) {
  const [ awsAccessKeyId, setAwsAccessKeyId ] = useState('');
  const [ awsSecretAccessKey, setAwsSecretAccessKey ] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    async function initializeCreds() {
      const awsAccessKeyId = await SecureStore.getItemAsync('awsAccessKeyId');
      const awsSecretAccessKey = await SecureStore.getItemAsync('awsSecretAccessKey');
      setAwsAccessKeyId(awsAccessKeyId);
      setAwsSecretAccessKey(awsSecretAccessKey);
    }
    initializeCreds();
  }, [])

  if (!permission) {
    return <View />;
  }

  async function takePicture() {
    if (this.camera) {
      setShowSpinner(true);
      this.camera.pausePreview();
      const data = await this.camera.takePictureAsync({ base64: true });
      const imageByte = Buffer.from(data.base64, 'base64');
      const textractResponse = await textract.detectDocumentText({
        data: imageByte,
        credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey}
      });
      const scanModel = ScanModel.fromTextractResponse(textractResponse);
      setShowSpinner(false);
      this.camera.resumePreview();
      navigation.navigate('Scan Result', {
        scannedText: scanModel.text,
      })
    }
  }

  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={'Analysing...'}
      />

      { /* This may need to be moved, depending on the camera component handles no permissions? */ }
      <Alert
        visible = {!permission.granted}
        modalTitle={"Camera Access"}
        modalText={"For our application to work we require access to your camera."}
        onConfirm={(confirmed) => { confirmed ? requestPermission() : navigation.navigate("Login") }} />

      <View style={styles.container}>
        <Pressable style={styles.configIcon} onPress={() => navigation.navigate('Config')}>
          <FontAwesome name="gear" size={40} color="black" />
        </Pressable>
        <Camera style={styles.camera} type={CameraType.back} ref={ref => { this.camera = ref}} />
        <Button
          style={styles.captureButton}
          title="Capture"
          onPress={takePicture}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: '80%',
  },
  captureButton: {
    marginBottom: 40,
    paddingBottom: 40,
  },
  configIcon: {
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});