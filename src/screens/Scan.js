import React, {useEffect, useState} from "react";

import {View, StyleSheet} from 'react-native';
import {Camera, CameraType} from 'expo-camera';

import {Screen} from "../components/Layout";
import {CaptureButton, TextButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";
import {Alert} from "../components/Modals.js";

export default function Scan({ route, navigation }) {

  const {retakeMode, imageIndex} = route.params;
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [photos, setPhotos] = useState([]);
  const [backString, setBackString] = useState("Cancel");
  const [allowCapture, setAllowCapture] = useState(true);
  const [mountCamera, setMountCamera] = useState(false);

  // enable mount each time we load the camera, we must unmount each time we leave
  // or else the camera freezes 🥺
  const isFocused = navigation.isFocused();

  useEffect(() => {

    if (isFocused) {
      // Call only when screen open or when back on screen
      setMountCamera(true);
      console.log("mounted camera");
    }

  }, [isFocused]);

  if (permission === null) {
    return <View></View>
  }

  async function takePicture() {

    if (!this.camera) {
      return;
    }

    if (retakeMode) {
      this.camera.pausePreview();
    }

    const data = await this.camera.takePictureAsync({ base64: true })

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
    }
  }

  function returnToPreviousScreen() {

    setMountCamera(false);

    // if in retake mode, and we have taken a photo, then allow for another retake before exiting
    if (retakeMode && photos.length !== 0) {

      this.camera.resumePreview();
      setBackString("Cancel");

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

    setMountCamera(false);

    if (retakeMode && photos.length !== 0) {
      this.camera.resumePreview();
      setBackString("Cancel");
    }

    navigation.navigate('Image Gallery', {
      photos:  photos,
    })
  }

  return (
    <Screen>
      <Alert
        visible = {permission.granted === false}
        modalTitle={"Camera Access"}
        modalText={"For our application to work we require access to your camera."}
        onConfirm={(confirmed) => { confirmed ? requestPermission() : navigation.goBack() }} />

      <View style={styles.view}>
        { mountCamera ?
          <Camera
            style={styles.camera}
            type={CameraType.back}
            ref={ref => { this.camera = ref}}/>
          :
          <View
            style={styles.camera}/>}
        <View style={styles.footer}>
          <View style={styles.row}>
            <TextButton
              style={styles.textNormal}
              onPress={() => returnToPreviousScreen()} buttonText={backString}/>

            <CaptureButton
              active={allowCapture}
              onPress={() => {
                setAllowCapture(false);
                takePicture().then(() => { setAllowCapture(true); })
              }}
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