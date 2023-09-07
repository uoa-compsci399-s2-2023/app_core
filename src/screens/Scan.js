import React, {useState} from "react";
import Spinner from 'react-native-loading-spinner-overlay';

import {View, StyleSheet} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {Buffer} from 'buffer';

import textract from "../textract.js";
import ScannedNote from "../models/ScannedNote.js";

import {Screen} from "../components/Layout";
import {CaptureButton, TextButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";

export default function Scan({ route, navigation }) {

  const {retakeMode} = route.params;

  const [capturing, setCapturing] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [backString, setBackString] = useState("Cancel");

  function takePicture() {

    if (!this.camera) {
      return;
    }

    // this is so hacky omg,
    // stop our button from being pressed while capturing
    setCapturing(true);

    this.camera.pausePreview();
    this.camera.takePictureAsync({ base64: true }).then((data) => {

      if (retakeMode) {
        setBackString("Retake");
        setPhotos([data.base64]);
      }
      else {
        // store the base 64 of our photo into our "photos" array
        setPhotos(oldPhotos => [...oldPhotos, data.base64]);

        // resume our ability to take another photo
        setCapturing(false);
        this.camera.resumePreview();
      }
    });
  }

  function returnToPreviousScreen() {

    setPhotos([]);

    // if in retake mode, and we have taken a photo, then allow for another retake before exiting
    if (retakeMode && photos.length === 1) {

      setBackString("Cancel");
      setCapturing(false);

      this.camera.resumePreview();
    }
    else {
      navigation.goBack();
    }
  }

  function gotoGallery() {

    // todo: rewrite once we have gallery implemented, right now it just passes the everything to Textract
    // and goes to the Scan results screen
    if (retakeMode && photos.length === 1) {

      setShowSpinner(true);

      setTimeout(() => {
        textract.detectDocumentText({
          data: Buffer.from(photos.at(0), 'base64'),
          credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
        }).then((response) => {
  
          // return states back to normal
          setPhotos([]);
          setBackString('Cancel');
          setCapturing(false);
          setShowSpinner(false);
          this.camera.resumePreview();
  
          navigation.navigate('Scan Result', {
            scannedText:  ScannedNote.fromTextractResponse(response).text,
          })
        });
      }, 1000);
    }
  }

  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={'Analysing...'}
      />

      <View style={styles.view}>
        <Camera style={styles.camera} type={CameraType.back} ref={ref => { this.camera = ref}} />
        <View style={styles.footer}>
          <View style={styles.row}>
            <TextButton
              style={styles.textNormal}
              onPress={() => returnToPreviousScreen()} buttonText={backString}/>

            <CaptureButton
              active={!capturing}
              onPress={() => { takePicture() }}
              retakeMode={retakeMode}/>

            <TextButton
              style={styles.textImportant}
              onPress={() => gotoGallery()}
              buttonText={"Done"}
              disabled={photos.length === 0}/>
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