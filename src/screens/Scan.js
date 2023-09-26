import React, {useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';

import {View, StyleSheet, Text, TouchableOpacity, PixelRatio } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {Buffer} from 'buffer';

import textract from "../textract.js";
import ScannedNote from "../models/ScannedNote.js";
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import {Screen} from "../components/Layout";
import {Alert} from "../components/Modals.js";
import {CaptureButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";

const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;

export default function Scan({ route, navigation }) {

  const {retakeMode} = route.params;
  //
  const renderProfileOption = () => (
    <TouchableOpacity onPress={toggleModal} style={styles.profileButton}>
      <Icon name="user" size={20} color="white" />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: renderProfileOption
    })
  }, [navigation]
  );

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const [capturing, setCapturing] = useState(false);
  const [missingAWS, setMissingAWS] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [backString, setBackString] = useState("Cancel");
  const [textractError, setTextractError] = useState(null);

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
          setBackString('Cancel');
          setCapturing(false);
          setShowSpinner(false);
          this.camera.resumePreview();
  
          navigation.navigate('Scan Result', {
            scannedText:  ScannedNote.fromTextractResponse(response).text,
          })
        }).catch(err => {
          setTextractError(err)
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

      <View>
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalText}>Settings</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutButton}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
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
        <Camera style={styles.camera} type={CameraType.back} ref={ref => { this.camera = ref}} />
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text
              style={[styles.textButton, styles.textNormal]}
              onPress={() => returnToPreviousScreen()}>{backString}</Text>

            <CaptureButton active={!capturing} onPress={() => { takePicture() }} retakeMode={retakeMode}/>

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
  doneButton: {
    color: 'blue',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  footer: {
    flexDirection: "column",
    height: "25%",
    justifyContent: "center",
    width: "100%",
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  logoutButton: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: lightTheme.backgroundDark,
    borderRadius: 100,
    height: 30,
    justifyContent: 'center',
    margin: 1,
    width: 30,
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
    width: "100%"
  },
});