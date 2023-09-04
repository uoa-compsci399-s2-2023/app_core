import React, {useState} from "react";

import {View, StyleSheet, Text} from 'react-native';
import {Camera, CameraType} from 'expo-camera';

import {Screen} from "../components/Layout";
import {Alert} from "../components/Modals.js";
import {CaptureButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";

export default function Scan({ navigation }) {

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [capturing, setCapturing] = useState(false);
  const [, setPhotos] = useState([]);

  if (!permission) {
    return <View></View>
  }

  function takePicture() {

    if (!this.camera) {
      return;
    }

    // this is so hacky omg,
    // stop our button from being pressed while capturing
    setCapturing(true);
    this.camera.pausePreview();
    this.camera.takePictureAsync().then((data) => {

      // store the base 64 of our photo into our "photos" array
      setPhotos(oldPhotos => [...oldPhotos, data.base64]);

      // resume our ability to take another photo
      setCapturing(false);
      this.camera.resumePreview();
    });
  }

  function returnToPreviousScreen() {
    navigation.goBack();
    setPhotos([]);
  }

  function gotoGallery() {

  }

  return (
    <Screen>
      <Alert
        visible = {!permission.granted}
        modalTitle={"Camera Access"}
        modalText={"For our application to work we require access to your camera."}
        onConfirm={(confirmed) => { confirmed ? requestPermission() : navigation.goBack() }} />

      <View style={styles.view}>
        <Camera style={styles.camera} type={CameraType.back} ref={ref => { this.camera = ref}} />
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text style={[styles.textButton, styles.textNormal]} onPress={() => returnToPreviousScreen()}>{"Cancel"}</Text>
            <CaptureButton active={!capturing} onPress={() => { takePicture() }} />
            <Text style={[styles.textButton, styles.textImportant]} onPress={() => gotoGallery()}>{"Done"}</Text>
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
    fontSize: 24,
    fontWeight: "normal",
    textAlign: "center",
    width: 70
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