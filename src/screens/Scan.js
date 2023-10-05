import React, {useState, useEffect} from "react";
import Spinner from 'react-native-loading-spinner-overlay';

import {View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {Buffer} from 'buffer';

import textract from "../textract.js";
import ScannedNote from "../models/ScannedNote.js";
import Icon from 'react-native-vector-icons/FontAwesome';

import {Screen} from "../components/Layout";
import {CaptureButton} from "../components/Buttons.js";
import {lightTheme} from "../Theme.js";
import {useIsFocused} from "@react-navigation/native";
import { Alert } from '../components/Modals.js';
import Modal from 'react-native-modal';
import Accordion from "../components/Accordion";

export default function Scan({ navigation }) {
  
  const renderProfileOption = () => (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
      <Icon name="user" size={20} color="gray" />
    </TouchableOpacity>
  );

  const renderInfoOption = () => (
    <TouchableOpacity onPress={() => setShowInfoModal(true)} style={styles.profileButton}>
      <Icon name="info" size={20} color="gray" />
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: renderProfileOption,
      headerRight: renderInfoOption,
      headerStyle: {
        backgroundColor: lightTheme.backgroundDark
      },
      headerTitle: ''
    });
  }, [navigation]);

  const [capturing, setCapturing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
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

  function gotoGallery() {

    setShowSpinner(true);

    if (!this.camera) {
      return;
    }
    // this is so hacky omg,
    // stop our button from being pressed while capturing
    setCapturing(true);
    this.camera.takePictureAsync({ base64: true }).then((data) => {
      this.camera.pausePreview();
      setTimeout(() => {
        textract.detectDocumentText({
          data: Buffer.from(data.base64, 'base64'),
          credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
        }).then((response) => {
          setEnableCamera(false);
          navigation.navigate('Scan Result', {
            scannedText:  ScannedNote.fromTextractResponse(response).text,
          })
        }).catch(err => {
          setTextractError(err)
        }).finally(() => {
          // return states back to normal
          setCapturing(false);
          setShowSpinner(false);
        });
      }, 1000);
    });
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
        <Modal isVisible={showInfoModal}>
          <ScrollView style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>How can we help you?</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <Text style={styles.doneButton}>
                  <Icon name="times" size={30} color="gray" />
                </Text>
              </TouchableOpacity>
            </View>
            <Text></Text>
            <View style={styles.accordionContainer}>
              <Accordion title='What is Tabs?' data={`Tabs is a mobile application that aims to streamline the process of integrating hand-taken notes into the cloud. \n\nTabs achieves this by leveraging the power of machine learning and use of existing cloud storage solutions.`} />
              <Accordion title='How do I use Tabs?' data={`1. Take a picture of a handwritten note. Tabs will extract the text from the note you scanned. This process can take up to a minute. \n\n2. Verify the extracted text is correct - make any edits if necessary. \n\n3. Tabs will extract "tokens" from the text. These are characters that have a special meaning when extracted. Read the "What tokens does Tabs recognise?" section for more info. \n\n4. Submit! Tabs will automatically upload the note to your OneDrive, and any tasks specified into your ToDo. \n\n5. Profit!`} />
              <Accordion title='What tokens does Tabs recognise?' data={`Tabs recognises some characters which are known as "tokens". These tokens have special meaning when extracted from the scanned text.\n\nTitle:\nThis token specifies the name of the file once uploaded into OneDrive. \nE.g. "Title: My Meeting Notes"\n\nFolder:\nThis token specifies the directory to upload the file into OneDrive.\nE.g. "Folder: my_meeting_notes/friday_notes"\n\n# and @\nThese tokens are used to define tasks. Use # to define a task and @ to define the due date.\nE.g. "# Pick up groceries @ 23/10/2023"`} />
            </View>
          </ScrollView>
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
            <CaptureButton active={!capturing} onPress={() => { gotoGallery() }}/>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 40,
  },
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
  modalContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
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
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  view: {
    backgroundColor: lightTheme.backgroundDark,
    flexDirection: "column",
    height: "100%",
    width: "100%"
  },
});