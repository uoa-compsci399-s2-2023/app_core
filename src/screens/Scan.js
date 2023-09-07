import React, {useState} from "react";

import {View, StyleSheet} from 'react-native';
import {Camera, CameraType} from 'expo-camera';

import {Screen} from "../components/Layout";
import {Alert} from "../components/Modals.js";
import {CaptureButton, TextButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";

export default function Scan({ route, navigation }) {

  const {retakeMode, imageIndex} = route.params;
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [capturing, setCapturing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [backString, setBackString] = useState("Cancel");

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
    this.camera.takePictureAsync({ base64: true }).then((data) => {

      if (retakeMode) {

        setBackString("Retake");

        // update photos
        const newPhotoArray = [
          ...photos.slice(0, imageIndex),
          data,
          ...photos.slice(imageIndex + 1)
        ];

        setPhotos(newPhotoArray);
      }
      else {
        // store the base 64 of our photo into our "photos" array
        setPhotos(oldPhotos => [...oldPhotos, data]);

        // resume our ability to take another photo
        setCapturing(false);
        this.camera.resumePreview();
      }
    });
  }

  function returnToPreviousScreen() {

    // if in retake mode, and we have taken a photo, then allow for another retake before exiting
    if (retakeMode && photos.length !== 0) {

      setBackString("Cancel");
      setCapturing(false);

      this.camera.resumePreview();

      if (backString !== "Retake") {
        navigation.navigate('Image Gallery', {
          photos:  photos,
        })
      }
    }
    else {
      setPhotos([]);
      navigation.goBack();
    }
  }

  function gotoGallery() {

    if (retakeMode && photos.length !== 0) {
      setBackString("Cancel");
      setCapturing(false);

      this.camera.resumePreview();
    }

    navigation.navigate('Image Gallery', {
      photos:  photos,
    })
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
    paddingLeft: "5%",
    paddingRight: "5%"
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