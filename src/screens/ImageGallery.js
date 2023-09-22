import React, {useState} from 'react'
import Spinner from 'react-native-loading-spinner-overlay';

import {Image, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import {Buffer} from 'buffer';

import textract from "../textract.js";
import ScannedNote from "../models/ScannedNote.js";

import {lightTheme, scaledSize, SCREEN_HEIGHT} from "../Theme.js";
import {Screen} from "../components/Layout";
import {TabsButton} from "../components/Buttons.js";

export default function ImageGallery({ route, navigation }) {

  const {photos} = route.params;

  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerString, setSpinnerString] = useState("");

  const imagePreview = (i) => {

    if (i >= photos.length) {
      return <View></View>
    }

    return (
      <TouchableOpacity style={styles.imagePreview} onPress={ () => navigation.navigate("Scan", { retakeMode: true, imageIndex: i})}>
        <Image source={{uri: photos.at(i).uri}} style={styles.image}/>
      </TouchableOpacity>
    );
  }

  const renderThumbnails = () => {

    const thumbnails = [];

    for (let i = 0; i < photos.length; i += 2) {

      thumbnails.push(
        <View key={i} style={[styles.row, styles.imageRow]}>
          {imagePreview(i)}
          {imagePreview(i + 1)}
        </View>
      );
    }

    return thumbnails;
  };

  const processTextract = async () => {

    setSpinnerString(`Processing...`);
    setShowSpinner(true);

    let textractResponseString = "";

    for (let i = 0; i < photos.length; i++) {

      const photo = photos.at(i);
      setSpinnerString(`Processing: ${i + 1}/${photos.length}...`);

      const response = await textract.detectDocumentText({
        data: Buffer.from(photo.base64, 'base64'),
        credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY}
      });

      textractResponseString += ScannedNote.fromTextractResponse(response).text + "\n";
    }

    // return states back to normal
    setShowSpinner(false);

    navigation.navigate('Scan Result', {
      scannedText:  textractResponseString,
    })
  }

  return (
    <Screen>
      <Spinner
        visible={showSpinner}
        textContent={spinnerString}
        textStyle={styles.spinnerText}
      />

      <View style={styles.view}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {renderThumbnails()}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.row}>
            <TabsButton text={"Cancel"} onPress={() => navigation.navigate("Login")}/>
            <TabsButton text={"Confirm"} onPress={() => processTextract()}/>
          </View>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  footer: {
    bottom: "2%",
    flexDirection: "column",
    height: "10%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  image: {
    borderRadius: scaledSize(10),
    height: "100%",
    resizeMode: "cover",
    width: "100%"
  },
  imagePreview: {
    height: "100%",
    width: "48%",
  },
  imageRow: {
    height: SCREEN_HEIGHT * 0.33,
    padding: "2%",
    width: "100%",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "5%",
    paddingRight: "5%"
  },
  scrollView: {
    paddingBottom: "5%",
    paddingTop: "5%",
    width: "100%"
  },
  spinnerText: {
    color: lightTheme.text,
    fontSize: scaledSize(24),
    fontWeight: "normal",
    textAlign: "center"
  },
  view: {
    backgroundColor: lightTheme.backgroundDark,
    flexDirection: "column",
    minHeight: "100%",
    width: "100%"
  }
})