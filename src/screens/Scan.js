import React, {useState, useEffect} from "react";
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
import {CaptureButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";
import {useIsFocused} from "@react-navigation/native";
import { Alert } from '../components/Modals.js';

const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;

export default function Scan({ navigation }) {
  
  const renderProfileOption = () => (
    <TouchableOpacity onPress={toggleModal} style={styles.profileButton}>
      <Icon name="user" size={20} color="gray" />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: renderProfileOption,
      headerStyle: {
        backgroundColor: lightTheme.backgroundDark
      },
      headerTitle: ''
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
  const [showSpinner, setShowSpinner] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [textractError, setTextractError] = useState(null);
  const [enableCamera, setEnableCamera] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions()

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

    setShowSpinner(true);

    setTimeout(() => {
      textract.detectDocumentText({
        data: Buffer.from(photos.at(0), 'base64'),
        credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
      }).then((response) => {
        navigation.navigate('Scan Result', {
          scannedText:  ScannedNote.fromTextractResponse(response).text,
        })
      }).catch(err => {
        setTextractError(err)
      }).finally(() => {
        // return states back to normal
        setPhotos([]);
        setCapturing(false);
        setShowSpinner(false);
        setEnableCamera(false);
      });
    }, 1000);
  }

  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={'Analysing...'}
        overlayColor='rgba(236, 240, 241, 0.5)'
        color='black'
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
  doneButton: {
    color: '#0078D4',
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: '#F0F0F0',
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
    backgroundColor: '#F1FEFB',
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