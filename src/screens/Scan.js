import React, {useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';

import {View, StyleSheet, Text, PixelRatio} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {Buffer} from 'buffer';

import textract from "../textract.js";
import ScannedNote from "../models/ScannedNote.js";

import {Screen} from "../components/Layout";
import {Alert} from "../components/Modals.js";
import {CaptureButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";
import {useIsFocused} from "@react-navigation/native";

const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;

export default function Scan({ navigation }) {

  const [capturing, setCapturing] = useState(false);
  const [missingAWS, setMissingAWS] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [textractError, setTextractError] = useState(null);
  const [enableCamera, setEnableCamera] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions()

  // todo: remove once we have gallery view
  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');

  useEffect(() => {
    function initializeCredentials() {

      SecureStore.getItemAsync('awsAccessKeyId')
        .then((result) => setAwsAccessKeyId(result));

      SecureStore.getItemAsync('awsSecretAccessKey')
        .then((result) => setAwsSecretAccessKey(result));
    }

    initializeCredentials();
  }, [])

  useEffect(() => {

    if (!permission || !permission.granted) {
      requestPermission().then();
    }

  }, [permission]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setEnableCamera(true);
    }
    else {
      setEnableCamera(false);
    }
  }, [isFocused]);

  function takePicture() {

    if (!this.camera) {
      return;
    }

    // this is so hacky omg,
    // stop our button from being pressed while capturing
    setCapturing(true);

    this.camera.takePictureAsync({ base64: true }).then((data) => {

      // store the base 64 of our photo into our "photos" array
      setPhotos(oldPhotos => [...oldPhotos, data.base64]);

      // resume our ability to take another photo
      setCapturing(false);
    });
  }

  function returnToPreviousScreen() {

    setPhotos([]);
    setCapturing(false);
    setEnableCamera(false);
    navigation.goBack();
  }

  function gotoGallery() {

    const noAwsCredentials =
      awsAccessKeyId == null || awsSecretAccessKey == null ||
      awsAccessKeyId.length === 0 || awsSecretAccessKey.length === 0;

    setMissingAWS(noAwsCredentials);

    if (noAwsCredentials) {
      return;
    }

    setShowSpinner(true);

    setTimeout(() => {
      textract.detectDocumentText({
        data: Buffer.from(photos.at(0), 'base64'),
        credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey}
      }).then((response) => {

        // return states back to normal
        setPhotos([]);
        setCapturing(false);
        setShowSpinner(false);
        setEnableCamera(false);

        navigation.navigate('Scan Result', {
          scannedText:  ScannedNote.fromTextractResponse(response).text,
        })
      }).catch(err => {
        setTextractError(err)
      });
    }, 1000);
  }

  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={'Analysing...'}
      />

      <Alert
        visible={missingAWS}
        isError={true}
        modalTitle={"AWS Access Key"}
        modalText={"Could not find AWS access keys, please set your access keys first."}
        onConfirm={() => setMissingAWS(false)}/>
      
      <Alert
        visible={textractError}
        isError={true}
        modalTitle={"Processing failed."}
        modalText={JSON.stringify(textractError)}
        onConfirm={() => setTextractError(null)}
      />

      <View style={styles.view}>
        {enableCamera ?
          <Camera style={styles.camera} type={CameraType.back} ref={ref => { this.camera = ref}} /> :
          <View style={styles.camera}/>}
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text
              style={[styles.textButton, styles.textNormal]}
              onPress={() => returnToPreviousScreen()}>{"Cancel"}</Text>

            <CaptureButton active={!capturing} onPress={() => { takePicture() }}/>

            <Text
              style={[styles.textButton, styles.textImportant]}
              onPress={() => gotoGallery()}>{photos.length === 0 ? "" : "Done"}</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: "75%",
    width: "100%"
  },
  footer: {
    flexDirection: "column",
    height: "25%",
    justifyContent: "center",
    width: "100%",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20
  },
  textButton: {
    fontSize: getFontSize(24),
    fontWeight: "normal",
    textAlign: "center",
    width: getFontSize(85)
  },
  textImportant: {
    color: lightTheme.importantColor
  },
  textNormal: {
    color: lightTheme.text,
  },
  view: {
    backgroundColor: lightTheme.backgroundDark,
    flexDirection: "column",
    height: "100%",
    paddingTop: "14%",
    width: "100%"
  }
});